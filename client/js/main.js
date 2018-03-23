(function(d) {
    const API     = 'http://127.0.0.1:3000',
          FIND    = '/find',
          INSERT  = '/insert',
          UPDATE  = '/update',
          DELETE  = '/deleteOne',
          BACK_UP = '/getBackUp';

    let findBtn     = d.getElementById('findBtn'),
        insertBtn   = d.getElementById('insertBtn'),
        updateBtn   = d.getElementById('updateBtn'),
        backUpBtn   = d.getElementById('backUpBtn'),

        insertTxt   = d.getElementById('insertTxt'),
        updateTxt   = d.getElementById('updateTxt');

    // make async request and call callback after server send response
    function sendRequest(url, cb = null, method = 'GET', data = null) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        if (data != null) xhr.send(data);
        else xhr.send();
        xhr.onreadystatechange = () => {
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) return;
            // if callback not equal null
            if (cb != null) cb(xhr);
        };
    }

    function findAll(xhr) {
        let result;
        try {
            result = JSON.parse(xhr.responseText);
        } catch(ex) {
            return alert('Server error! Try to reload page or send request later.');
        }
        print(result);
        deleteItems = d.getElementsByClassName('deleteItemBtn');
        for (let i = 0; i < deleteItems.length; i++) {
            addDeleteHandl(deleteItems[i]);
        }
    }
    function insertOne(xhr) {
        alert('Success!');
    }
    function updateAll(xhr) {
        alert('Success!');
    }
    function deleteOne(xhr) {
        alert('Success!');
    }
    function getBackUp(xhr) {
        let result;
        try {
            result = JSON.parse(xhr.responseText);
        } catch(ex) {
            return alert('Server error! Try to reload page or send request later.');
        }
        printJson(JSON.stringify(result));
    }

    // buttons events
    findBtn.onclick = () => {
        let url = API + FIND;
        sendRequest(url, findAll);
    };
    insertBtn.onclick = () => {
        let url = API + INSERT;
        let data = 'name=' + insertTxt.name.value + '&' + 
                   'age=' + insertTxt.age.value + '&' + 
                   'country=' + insertTxt.country.value + '&' + 
                   'phone=' + insertTxt.phone.value + '&' + 
                   'type=' + insertTxt.type.value;
        sendRequest(url, insertOne, 'POST', data);
    };
    updateBtn.onclick = () => {
        let url = API + UPDATE;
        let data = 'id=' + updateTxt.id.value + '&' +
                   'key=' + updateTxt.key.value + '&' +
                   'value=' + updateTxt.value.value;
        sendRequest(url, updateAll, 'POST', data);
    };
    backUpBtn.onclick = () => {
        let url = API + BACK_UP;
        sendRequest(url, getBackUp);
    };

    // add remove item events
    function addDeleteHandl(el) {
        el.onclick = () => {
            let id = el.parentElement.parentElement.getElementsByClassName('itemId')[0].innerHTML.toString();
            let url = API + DELETE + '?id=' + id;
            sendRequest(url, deleteOne);
        };
    }

    /**
     * Render object and print to page
     * @param {object} obj model of user
     */
    function print(obj) {
        const printDiv = d.getElementById('printResult');
        let str = '';
        printDiv.innerHTML = '';
        for (let i = 0; i < obj.length; i++) {
            str = '<div class="item">' + 
                  '<div class="itemId">' + obj[i].id + '</div>' +
                  '<div>' + obj[i].name + '</div>' +
                  '<div>' + obj[i].age + '</div>' +
                  '<div>' + obj[i].country + '</div>' +
                  '<div>' + obj[i].phone + '</div>' +
                  '<div>' + obj[i].type + '</div>' +
                  '<div><input type="button" value="delete" class="deleteItemBtn" /></div>' +
                  '</div>';
            printDiv.insertAdjacentHTML('beforeEnd', str);
            str = '';
        }
    }
    function printJson(json) {
        let e = d.getElementById('jsonBackUp');
        // make beatifull json
        let newJson = json
                        .replace(/\,/g, ',<br>')
                        .replace(/\{/g, '{<br>')
                        .replace(/\}/g, '}<br>')
                        .replace(/\[/g, '[<br>')
                        .replace(/\]/g, ']<br>');
        e.innerHTML = '';
        e.insertAdjacentHTML('beforeEnd', '<pre>' + newJson + '</pre>');
    }
    
})(document)
