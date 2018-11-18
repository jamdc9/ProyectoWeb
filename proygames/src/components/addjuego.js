//import the necessary files
import React from 'react';
import { Modal, ControlLabel, FormGroup, FormControl, Button } from 'react-bootstrap';

//create a class for displaying the modal for adding a new recipe and export it
export class AddJuego extends React.Component {
    constructor(props) {//create a state to handle the new recipe
        super(props);
        this.state = { name: "", consola: "", comentario: "", avatar: "" };
        this.handleJuegoNameChange = this.handleJuegoNameChange.bind(this);
        this.handleJuegoConsolasChange = this.handleJuegoConsolasChange.bind(this);
        this.handleJuegoComentarioChange = this.handleJuegoComentarioChange.bind(this);
        this.handleJuegoAvatarChange = this.handleJuegoAvatarChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    handleJuegoNameChange(e) {//change the name to reflect user input
        this.setState({ name: e.target.value });
    }
    handleJuegoConsolasChange(e) {//change the ingredients to reflect user input
        this.setState({ consola: e.target.value });
    }
    handleJuegoComentarioChange(e) {//change the ingredients to reflect user input
        this.setState({ comentario: e.target.value });
    }
    handleJuegoAvatarChange(e) {//change the ingredients to reflect user input
        this.setState({ avatar: e.target.value });
    }
    handleSubmit(e) {//get the recipe data, manipulate it and call the function for creating a new recipe
        e.preventDefault();
        const onAdd = this.props.onAdd;
        const regExp = /\s*,\s*/;
        var newName = this.state.name;
        var newConsolas = this.state.consola.split(regExp);
        var newComentario = this.state.comentario;
        var newAvatar = this.state.avatar;

        var newJuego = { name: newName, consolas: newConsolas, comentario: newComentario, avatar: newAvatar };
        onAdd(newJuego);
        this.setState({ name: "", consola: "", comentario: "", avatar: "" });
    }
    handleCancel() {
        const onAddModal = this.props.onAddModal;
        this.setState({ name: "", consola: "", comentario: "", avatar: "" });
        onAddModal();
    }
    render() {
        const onShow = this.props.onShow;
        var regex1 = /^\S/;
        var regex2 = /^[^,\s]/;
        var regex3 = /[^,\s]$/;
        const validJuego = regex1.test(this.state.name) && regex2.test(this.state.consola)
            && regex3.test(this.state.consola) && regex1.test(this.state.comentario)
            && regex1.test(this.state.avatar);
        return (
            <div >

                <Modal show={onShow} onHide={this.handleCancel} animation={false}>

                    <Modal.Header closeButton>
                        <Modal.Title>Agregar Juego</Modal.Title >
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup controlId="formControlsName">
                            <ControlLabel>Nombre del Juego</ControlLabel>
                            <FormControl type="text" required onChange={this.handleJuegoNameChange} value={this.state.name} placeholder="Enter Name" />
                        </FormGroup>
                        <FormGroup controlId="formControlsConsolas">
                            <ControlLabel>Consolas</ControlLabel>
                            <FormControl componentClass="textarea" type="text" required onChange={this.handleJuegoConsolasChange} value={this.state.consolas} placeholder="Ingrese los valores separados por COMA" />
                        </FormGroup>
                        <FormGroup controlId="formControlsComentario">
                            <ControlLabel>Comentario</ControlLabel>
                            <FormControl type="text" required onChange={this.handleJuegoComentarioChange} value={this.state.comentario} placeholder="Ingrese Comentario" />
                        </FormGroup>
                        <FormGroup controlId="formControlsFoto">
                            <ControlLabel>Foto URL</ControlLabel>
                            <FormControl type="text" required onChange={this.handleJuegoAvatarChange} value={this.state.avatar} placeholder="Ingrese URL de imagen" />
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button disabled={!validJuego} bsStyle="success" onClick={this.handleSubmit}>Guardar Juego</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
};