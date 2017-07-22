function updateTree(arr, len, i) {
    var largest = i;

    while (true) {
        var left = 2 * i + 1;
        var right = 2 * i + 2;

        if (left < len && arr[left].time > arr[i].time) {
            largest = left;
        } else {
            largest = i;
        }

        if (right < len && arr[right].time > arr[largest].time) {
            largest = right;
        }

        if (largest !== i) {
            var temp = arr[i];
            arr[i] = arr[largest];
            arr[largest] = temp;

            i = largest;
            continue;
        } else {
            break;
        }
    }

}

function buildHeap(arr) {
    var len = arr.length;

    for (var i = Math.floor((len -1) / 2); i >= 0; i--) {
        updateTree(arr, len, i);
    }
}

function heapSort(arr) {
    var i = arr.length;

    buildHeap(arr);

    // console.log(arr, 'aaaa')

    while(i > 0) {
        var temp = arr[i - 1];
        arr[i - 1] = arr[0];
        arr[0] = temp;

        i = i - 1;
        updateTree(arr, i, 0);
    }

    return arr;
}

module.exports = {
    heapSort: heapSort
}
