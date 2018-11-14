const express = require('express');
const app = express();

var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');
//var url = 'mongodb://localhost:27017/juegos';
var url = 'mongodb://mongo:27017';
var db;
mongo.connect(url, function (err, client) {
    if (!err) {
        console.log("We are connected");
        db = client.db('juegos');
    }
});

app.listen(3009);

console.log('Listening on port 3009...');
app.use(express.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT")
    next();
});

//Code   
app.get('/api/juegos/', function (req, res, next) {
    db.collection('juegos').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.send({ juegos: result })
    })
});

app.get('/api/juegos/:id', function (req, res, next) {
    db.collection('juegos').find({id:parseInt(req.params.id)}).toArray((err, result) => {
        res.send({juegos: result})
    }) 
    
});


router.post('/api/juegos/', function (req, res, next) {
    const juego = {
        name: req.body.name,
        consola: req.body.consola,
        comentario: req.body.comentario,
        avatar:req.body.avatar
    }
    db.collection('juegos').insertOne(juego, function (err, result) {
        assert.equal(null, err);
        if (err) return console.log(err)
        console.log("Item inserted");
        res.status(201).send(result);
    });
});

router.delete('/api/juegos/:id', function (req, res, next) {
    var id = req.params.id;
    db.collection('juegos').deleteOne({ "_id": objectId(id) }, function (err, result) {
        assert.equal(null, err);
        if (err) return console.log(err)
        console.log('Item deleted');
        res.status(204).send(result);
    });
});


router.put('/api/juegos/:id', function (req, res, next) {
    var id = req.params.id;
    const item = {
        name: req.body.name,
        consola: req.body.consola,
        comentario: req.body.comentario,
        avatar:req.body.avatar
    }

    db.collection('juegos').updateOne({ "_id": objectId(id) }, { $set: item }, function (err, result) {
        assert.equal(null, err);
        console.log('Item updated');
        res.status(204).send(item);
    });

});

app.put('/api/juegos/:id', (req, res) => {


    mongo.connect(url, function (err, db) {
        const juegosDB = db.db('juegosDB');
        var cursor = juegosDB.collection('juegos').find({ id: parseInt(req.params.id) });
        cursor.next(function (err, doc) {
            if (doc) {
                juegosDB.collection('juegos').updateOne({ id: parseInt(req.params.id) }, {
                    $set: {
                        name: req.body.name,
                        consola: req.body.consola,
                        comentario: req.body.comentario,
                        avatar:req.body.avatar
                    }
                })

                res.status(204).send(" Actualizado exitosamente")
            }
            else {
                res.status(404).send('ID brindado no se encontro')
            }
        });

    });


});

app.delete('/api/juegos/:id', (req, res) => {
    

    mongo.connect(url, function (err, db) {
        const juegosDB = db.db('juegosDB');
        var cursor = juegosDB.collection('juegos').find({ id: parseInt(req.params.id) });
        cursor.next(function (err, doc) {
            if (doc) {
                juegosDB.collection('juegos').deleteOne({ id: parseInt(req.params.id) })
                res.status(204).send("Eliminado exitosamente")
            }
            else {
                res.status(404).send('ID brindado no se encontro')
            }
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