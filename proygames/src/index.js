import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
/*import App from './App';
import registerServiceWorker from './registerServiceWorker';*/
import 'bootstrap/dist/css/bootstrap.min.css';

import { Button } from 'react-bootstrap';
import { ImageHeader } from "react-simple-card";

import { AddJuego } from './components/addjuego';
import { EditJuego } from './components/editjuego';

class VideoGames extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            juegos: [],
            id: 0,
            name: "",
            consolas: "",
            comentario: [],
            avatar: "",
            showAdd: false,
            showEdit: false,
            currentlyEditing: 0
        };
        this.showAddModal = this.showAddModal.bind(this);
        this.showEditModal = this.showEditModal.bind(this);
        this.addJuego = this.addJuego.bind(this);
        this.editJuego = this.editJuego.bind(this);
        this.deleteJuego = this.deleteJuego.bind(this);
    }
    //LocalStorage
    componentDidMount() {//load the local storage data after the component renders
        /*var juegos = (typeof localStorage["juegos"] !== "undefined") ? JSON.parse(localStorage.getItem("juegos")) : [
            { name: "Spiderman", consolas: ["PS2", "PS3", "PS4"], comentario: ["Sin jugarlo."], avatar: "https://img.game.co.uk/ml2/5/6/2/9/562944_scr9_a.png" },
            { name: "God of War", consolas: ["PS3", "PS4", "PSVita"], comentario: ["Muy buen juego."], avatar: "https://i.blogs.es/7548d0/god-of-war-2018-gameinformer/450_1000.jpg" },
            { name: "Pokemon", consolas: ["Game Boy Color", "Game Boy Advance", "Nintendo Game Cube", "Nintendo Wii"], comentario: ["Buenos Juegos"], avatar: "https://cdn02.nintendo-europe.com/media/images/10_share_images/games_15/gamecube_12/SI_GCN_PokemonColosseum_image1600w.jpg" },
            { name: "Sonic", consolas: ["Sega", "Nintendo(s)"], comentario: ["Infancia pura"], avatar: "https://c.slashgear.com/wp-content/uploads/2017/08/Sonic-Mania-green-hill-1-980x620.jpg" },
            { name: "Mario Sunshine", consolas: ["Nintendo Game Cube"], comentario: ["El mejor de Mario"], avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStaF3aV8CzgtAjdgEjIGH6fPDgr6IsaqY1lRQ033Xze7OR9mz5" },
            { name: "Age of Empires 2", consolas: ["PC"], comentario: ["Un clasico"], avatar: "https://i.ytimg.com/vi/Si6QPKiNoDY/maxresdefault.jpg" },
            { name: "Mario Kart", consolas: ["Todas las consolas de Nintendo despues del NES"], comentario: ["Pierde Amigos"], avatar: "https://vignette.wikia.nocookie.net/mariokart/images/7/7e/Mario-kart-double-dash-1.jpg/revision/latest?cb=20140521140749&path-prefix=es" }
        ];
        this.setState({ juegos: juegos });*/
        var url = "http://localhost:9090/api/juegos"
        fetch(url)
            .then(res => res.json())
            .then(json => {
                this.setState({
                    juegos: json.juegos
                })
            })
    }
    //ADD
    showAddModal() {//show the new recipe modal
        this.setState({ showAdd: !this.state.showAdd });
    }
    addJuego(juego) {//create a new recipe
        let juegos = this.state.juegos;
        juegos.push(juego);
        //localStorage.setItem('juegos', JSON.stringify(juegos));
        const url = 'http://localhost:9090/api/juegos';
        fetch(url,
            {
                method: 'POST',
                body: JSON.stringify(juego),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        console.log(juego);
        this.setState({ juegos: juegos });
        this.showAddModal();
    }
    //EDIT
    showEditModal(index) {//show the edit recipe modal
        this.setState({ showEdit: !this.state.showEdit, currentlyEditing: index });
    }
    editJuego(newName, newConsolas, newComentario
        , newAvatar, currentlyEditing) {//edit an existing recipe
        let juegos = this.state.juegos;
        juegos[currentlyEditing] = { _id: juegos[currentlyEditing]._id, name: newName, consolas: newConsolas, avatar: newAvatar, comentario: newComentario }; 
        var juego = { _id: juegos[currentlyEditing]._id, name: newName, consolas: newConsolas, avatar: newAvatar, comentario: newComentario };
        //var juego = juegos[currentlyEditing];
        //localStorage.setItem('juegos', JSON.stringify(juegos));
        const url = 'http://localhost:9090/api/juegos';
        console.log(JSON.stringify(juego));
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify(juego),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        this.setState({ juegos: juegos });
        this.showEditModal(currentlyEditing);
    }
    //Delete
    deleteJuego(index) {//delete an existing recipe
        let juegos = this.state.juegos;
        console.log('_id' + juegos[index]._id);
        //localStorage.setItem('juegos', JSON.stringify(juegos));
        const url = 'http://localhost:9090/api/juegos/' + juegos[index]._id;
        fetch(url, {
            method: 'DELETE',
            //body:JSON.stringify({id:index})
        })
        juegos.splice(index, 1);
        this.setState({ juegos: juegos, currentlyEditing: 0 });
    }
    render() {
        const juegos = this.state.juegos;
        console.log(juegos);
        return (
            <div className="jumbotron">

                <div className="title">
                    <div className="title-word">Juegos</div>
                    <div className="title-word">CRUD</div>
                    <div className="title-word">Ya casi</div>
                    <div className="title-word"><Button className="btn btn-outline-primary widthcien" onClick={this.showAddModal}>Agregar Juegos</Button></div>
                </div>

                <br />
                <AddJuego onShow={this.state.showAdd} onAdd={this.addJuego} onAddModal={this.showAddModal} />
                <div id="juegos" className="text-center">

                    <div className="row mt-30">
                        {juegos.map((juego, index) => (
                            <div className="col-xs-12 col-sm-6 col-md-6" key={index}>
                                <div className="box3" >
                                    <ImageHeader imageSrc={juego.avatar} data-toggle="tooltip" data-placement="bottom" title={juego.comentario} />
                                    <div className="box-content">
                                        <div className="card">

                                            <h1 className="title backTitulo" >{juego.name}</h1>
                                            <span className="post backTitulo">{juego.comentario}</span>
                                            <div className="row">

                                                {

                                                    Array.from(Object.keys(juego.consolas), k => juego.consolas[k]).map((consola, index) => (
                                                        <div className="col-md-6" key={index}>
                                                            <h2>{consola}</h2>
                                                        </div>
                                                    ))
                                                }
                                            </div>

                                            <Button className="btn btn-warning" onClick={() => { this.showEditModal(index) }}>Edit</Button>
                                            <Button className="btn btn-danger" onClick={() => { this.deleteJuego(index) }}>Delete</Button>

                                        </div>
                                    </div>
                                </div>
                                <EditJuego
                                    onShow={this.state.showEdit}
                                    onEdit={this.editJuego} 
                                    onEditModal={() => { this.showEditModal(this.state.currentlyEditing) }} 
                                    currentlyEditing={this.state.currentlyEditing} 
                                    juego={juegos[this.state.currentlyEditing]} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
};
//ReactDOM.render(<App />, document.getElementById('root'));
//registerServiceWorker();
ReactDOM.render(<VideoGames />, document.getElementById('app'));
