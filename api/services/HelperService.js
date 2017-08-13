module.exports = {

 containsObject : function(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {

        if (list[i].id == obj) {
            return true;
        }
    }

    return false;
}

}

   	// 		 var i;
    // for (i = 0; i < shop.products.length; i++) {

    //     if (shop.products[i].id === product.id) {
    //         return res.json(true);
    //     }
    // }

    // return res.json(false);

