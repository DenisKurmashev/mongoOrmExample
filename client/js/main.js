(function(d) {
    const API     = 'http://127.0.0.1:3000',
          FIND    = '/find',
          INSERT  = '/insert',
          UPDATE  = '/update',
          DELETE  = '/delete',
          BACK_UP ='/getBackUp';

    let findBtn = d.getElementById('findBtn'),
        insertBtn = d.getElementById('insertBtn'),
        updateBtn = d.getElementById('updateBtn'),
        deleteBtn = d.getElementById('deleteBtn'),
        backUpBtn = d.getElementById('backUpBtn');

    // make async request and call callback after server send response
    function sendRequest(url, cb = null, method = 'GET', data = null) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        if (data != null) xhr.send(data);
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
    }
    function insertOne(xhr) {
        
    }
    function updateAll(xhr) {
        
    }
    function deleteOne(xhr) {
        
    }
    function getBackUp(xhr) {
        
    }

    // buttons events
    findBtn.onclick = () => {
        let url = API + FIND;
        sendRequest(url, findAll);
    };
    insertBtn.onclick = () => {
        let url = API + INSERT;
        sendRequest(url, insertOne);
    };
    updateBtn.onclick = () => {
        let url = API + UPDATE;
        sendRequest(url, updateAll);
    };
    deleteBtn.onclick = () => {
        let url = API + DELETE;
        sendRequest(url, deleteOne);
    };
    deleteBtn.onclick = () => {
        let url = API + BACK_UP;
        sendRequest(url, getBackUp);
    };
    
})(document)
