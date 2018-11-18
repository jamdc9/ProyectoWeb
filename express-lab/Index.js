const express = require('express');
const app = express();

var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');
//var url = 'mongodb://localhost:27017/juegos';
var url = 'mongodb://mongo:27017';
var redis = require("redis");
var cache = require('express-redis-cache')({
    //host: 'localhost',port: 6379
    host: 'redis-host',port: 6379
});
cache.on('error', function(error){
    console.log('cache error!'+ error);
    return;
});
var db;
mongo.connect(url, function (err, client) {
    if (!err) {
        console.log("We are connected");
        db = client.db('juegos');
    }
});

app.listen(9090);

console.log('Listening on port 9090...');
app.use(express.json())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT, DELETE")
    next();
});

//Code   
app.get('/api/juegos/', cache.route({expire : 90, name:'allGames'}) , function (req, res, next) {
    mongo.connect(url, function (err, client) {
        if (!err) {
            db = client.db('juegos');
        }
        db.collection('juegos').find().toArray((err, result) => {
            if (err) return console.log(err)
            res.send({ juegos: result })
        });
    });

});

app.get('/api/juegos/:id', function (req, res, next) {
    console.log(req.params.id);
    db.collection('juegos').find({ _id: objectId(req.params.id) }).toArray((err, result) => {
        res.send({ juegos: result })
    })

});


app.post('/api/juegos', function (req, res, next) {
    //console.log(req);
    const juego = {
        //_id: req.body._id,
        name: req.body.name,
        consolas: req.body.consolas,
        comentario: req.body.comentario,
        avatar: req.body.avatar
    }
    console.log(juego);
    mongo.connect(url, function (err, client) {
        if (!err) {
            db = client.db('juegos');
        }
        db.collection('juegos').insertOne(juego, function (err, result) {
            cache.del('allGames', (err, juego) => {
                assert.equal(null, err);
                if (err) return console.log(err)
                console.log("Item inserted");
                res.status(201).send(result);
            });
            client.close();
        });
    });
});

app.put('/api/juegos', function (req, res, next) {
    var id = req.body._id;
    const item = {
        name: req.body.name,
        consolas: req.body.consolas,
        comentario: req.body.comentario,
        avatar: req.body.avatar
    };
    mongo.connect(url, function (err, client) {
        if (!err) {
            console.log("We are connected PUT");
            db = client.db('juegos');
        }
        console.log(item);
        console.log(id);
        db.collection('juegos').updateOne({ "_id": objectId(id) }, { $set: item }, function (err, result) {
            assert.equal(null, err);
            console.log('Item updated');
            res.status(204).send(item);
            client.close();
        });
    });
});

app.delete('/api/juegos/:id', (req, res, next) => {
    var id = req.params.id;
    mongo.connect(url, function (err, client) {
        if (!err) {
            console.log("We are connected DELETE");
            db = client.db('juegos');
        }

        db.collection('juegos').deleteOne({ "_id": objectId(id) }, function (err, result) {
            //assert.equal(null, err);
            console.log('Item Deleted');
            if(err) return console.log(err);
            res.status(204).send(result);
            client.close();
        });
    });
});
/*app.use(express.json());

var lastId = 7;
var juegos1 = [
    { id: 1, name: "Spiderman", consolas: ["PS2", "PS3", "PS4"], comentario: ["Sin jugarlo."] },
    { id: 2, name: "God of War", consolas: ["PS3", "PS4", "PSVita"], comentario: ["Muy buen juego."] },
    { id: 3, name: "Pokemon", consolas: ["Game Boy Color", "Game Boy Advance", "Nintendo Game Cube", "Nintendo Wii"], comentario: ["Buenos Juegos"] },
    { id: 4, name: "Sonic", consolas: ["Sega", "Nintendo(s)"], comentario: ["Infancia pura"] },
    { id: 5, name: "Mario Sunshine", consolas: ["Nintendo Game Cube"], comentario: ["El mejor de Mario"] },
    { id: 6, name: "Age of Empires 2", consolas: ["PC"], comentario: ["Un clasico"] },
    { id: 7, name: "Mario Kart", consolas: ["Todas las consolas de Nintendo despues del NES"], comentario: ["Pierde Amigos"] }
];

app.get('/api/juegos', (req, res) => {
    res.status(200).send(juegos);
}
);
app.get('/api/juegos/:id', (req, res) => {
    const juego = juegos.find(j => j.id === parseInt(req.params.id));
    if (!juego) {
        req.status(404).send('Juego no encontrado.');
        return;
    }
    res.status(200).send(juego);
}
);

app.post('/api/juegos', (req, res) => {
    if (!req.body.name) {
        res.status(400).send('Debe ingresar name');
        return;
    }
    if (!req.body.consolas) {
        res.status(400).send('Debe ingresar consolas');
        return;
    }
    if (!req.body.comentario) {
        res.status(400).send('Debe ingresar comentario');
        return;
    }

    lastId++;
    const juego =
    {
        id: lastId,
        name: req.body.name,
        consolas: req.body.consolas,
        comentario: req.body.comentario
    };
    juegos.push(juego);
    res.status(201).send(juegos);
}
);

app.put('/api/juegos/:id', (req, res) => {
    const juego = juegos.find(j => j.id === parseInt(req.params.id));
    if (!juego) {
        req.status(404).send('Juego no encontrado.');
        return;
    }
    if (!req.body.name) {
        res.status(400).send('Debe ingresar name');
        return;
    }
    if (!req.body.consolas) {
        res.status(400).send('Debe ingresar consolas');
        return;
    }
    if (!req.body.comentario) {
        res.status(400).send('Debe ingresar comentario');
        return;
    }

    juego.name = req.body.name;
    juego.consolas = req.body.consolas;
    juego.comentario = req.body.comentario;
    res.status(204).send(juego);
}
);

app.delete('/api/juegos/:id', (req, res) => {
    const juego = juegos.find(j => j.id === parseInt(req.params.id));
    if (!juego) {
        req.status(404).send('Juego no encontrado.');
        return;
    }
    const index = juegos.indexOf(juego);
    juegos.splice(index, 1);
    res.status(204).send(juegos);
}
);*/