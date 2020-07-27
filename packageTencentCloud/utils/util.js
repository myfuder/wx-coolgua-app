var index = 1;

export function setSort4Array(array) {
    return array.map(item => {
        if (!item._sort) {
            item._sort = index;
            index++;
        }
        return item;
    });
}

function compare(property) {
    return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    };
}

export function mergeArray(a1, a2 = [], key) {
    var a1 = setSort4Array(a1);
    var _key = key || "id";
    var finshArray = a1;
    a2.map(item2 => {
        var isExit = false;
        a1.map(item1 => {
            if (item1[_key] == item2[_key]) {
                isExit = true;
            }
        });
        if (!isExit) {
            finshArray.push(item2);
        }
    });

    var newList = finshArray.sort(compare("_sort"));
    return newList;
}