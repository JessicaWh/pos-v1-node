var myFunc = require('./datbase.js')

function count_same_elements(inputs) {
    var res = [];

    for(var i=0; i < inputs.length; i++) {
        var temp_count_i = 1;
        var temp_value_i = inputs[i];

        if( inputs[i].indexOf('-') != -1) { //获取到的元素a-5形式的
            temp_value_i = inputs[i].split('-')[0];
            temp_count_i = parseInt(inputs[i].split('-')[1]);
        }
        for(var j = i+1; j < inputs.length; j++){
            var temp_value_j = inputs[j];
            var temp_count_j = 1;
            if( inputs[j].indexOf('-') != -1) { //获取到的元素a-5形式的
                temp_value_j = inputs[j].split('-')[0];
                temp_count_j = parseInt(inputs[j].split('-')[1]);
            }
            if(temp_value_j == temp_value_i){
                temp_count_i += temp_count_j;
                inputs.splice(j,1);
                j-=1;
            }
        }
        res.push({"barcode":temp_value_i,"count":temp_count_i});
    }
    return res;
}


module.exports = function printInventory(inputs) {
    var preInputs = count_same_elements(inputs);//预处理后的输入

    var allItems = myFunc.loadAllItems();
    var allPromotions = myFunc.loadPromotions();

    var str = '***<没钱赚商店>购物清单***\n';
    var strPro = '----------------------\n挥泪赠送商品：\n';
    var totalPrice = 0;
    var noPro = 0;

    for(var i=0; i<preInputs.length; i++){
        for(var j=0; j<allItems.length; j++){
            if(preInputs[i].barcode === allItems[j].barcode){
                str += "名称："+allItems[j].name+'，数量：'+preInputs[i].count+allItems[j].unit+'，单价：'+allItems[j].price.toFixed(2)+'(元)，小计：';
                for(var k=0; k<(allPromotions[0].barcodes).length; k++){
                    if(preInputs[i].barcode === (allPromotions[0].barcodes)[k]){
                        noPro += preInputs[i].count * allItems[j].price;
                        totalPrice += (preInputs[i].count-1) * allItems[j].price;
                        str += ((preInputs[i].count-1) * allItems[j].price).toFixed(2)+'(元)\n';
                        strPro += '名称：'+allItems[j].name+'，数量：1'+allItems[j].unit+'\n';
                        break;
                    }
                    if(k === (allPromotions[0].barcodes).length - 1){
                        str += (preInputs[i].count * allItems[j].price).toFixed(2)+'(元)\n';
                        noPro += preInputs[i].count * allItems[j].price;
                        totalPrice += preInputs[i].count * allItems[j].price;
                    }
                }
                break;
            }
        }
    }
    str += strPro+'----------------------\n总计：'+totalPrice.toFixed(2)+'(元)\n节省：'+(noPro-totalPrice).toFixed(2)+'(元)\n**********************';
    console.log(str);

    return 'Hello World!';
};