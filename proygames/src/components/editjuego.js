//import the necessary files
import React from 'react';
import { Modal, ControlLabel, FormGroup, FormControl, Button } from 'react-bootstrap';

//create a class for displaying the modal for editing an existing juego and export it
export class EditJuego extends React.Component {
    constructor(props) {//create a state to handle the juego to be edited
        super(props);
        this.state = { name: "", consolas: "", comentario: "", avatar: "" };
        this.handleJuegoNameChange = this.handleJuegoNameChange.bind(this);
        this.handleJuegoConsolasChange = this.handleJuegoConsolasChange.bind(this);
        this.handleJuegoComentarioChange = this.handleJuegoComentarioChange.bind(this);
        this.handleJuegoAvatarChange = this.handleJuegoAvatarChange.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    static getDerivedStateFromProps(props, state) {//make the juego prop a state
        const prevName = state.prevName;
        const prevConsolas = state.prevConsolas;
        const prevComentario = state.prevComentario;
        const prevAvatar = state.prevAvatar;
        const name = prevName !== props.juego.name ? props.juego.name : state.name;
        const consolas = prevConsolas !== props.juego.consolas.join(",") ? props.juego.consolas.join(",") : state.consolas;
        const comentario = prevComentario !== props.juego.comentario ? props.juego.comentario : state.comentario;
        const avatar = prevAvatar !== props.juego.avatar ? props.juego.avatar : state.avatar;
        return {
            prevName: props.juego.name, name,
            prevConsolas: props.juego.consolas.join(","), consolas,
            prevComentario: props.juego.comentario, comentario,
            prevAvatar: props.juego.avatar, avatar,
        }
    }
    handleJuegoNameChange(e) {//change the name to reflect user input
        this.setState({ name: e.target.value });
    }
    handleJuegoConsolasChange(e) {//change the ingredients to reflect user input
        this.setState({ consolas: e.target.value });
    }
    handleJuegoComentarioChange(e) {//change the ingredients to reflect user input
        this.setState({ comentario: e.target.value });
    }
    handleJuegoAvatarChange(e) {//change the ingredients to reflect user input
        this.setState({ avatar: e.target.value });
    }
    handleEdit(e) {//get the juego data, manipulate it and call the function for editing an existing juego
        e.preventDefault();
        const onEdit = this.props.onEdit;
        const currentlyEditing = this.props.currentlyEditing;
        const regExp = /\s*,\s*/;
        var name = this.state.name;
        var consolas = this.state.consolas.split(regExp);
        var comentario = this.state.comentario;
        var avatar = this.state.avatar;
        onEdit(name, consolas, comentario, avatar, currentlyEditing);
    }
    handleCancel() {
        const onEditModal = this.props.onEditModal;
        this.setState({
            name: this.props.juego.name, consolas: this.props.juego.consolas.join(","), comentario: this.props.juego.comentario,
            avatar: this.props.juego.avatar
        });
        onEditModal();
    }
    render() {
        const onShow = this.props.onShow;
        var regex1 = /^\S/;
        var regex2 = /^[^,\s]/;
        var regex3 = /[^,\s]$/;
        const validJuego = regex1.test(this.state.name) && regex2.test(this.state.consolas)
            && regex3.test(this.state.consolas) && regex1.test(this.state.comentario)
            && regex1.test(this.state.avatar);
        return (
            <div>
                <Modal show={onShow} onHide={this.handleCancel} animation={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Juego</Modal.Title>
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
                        <Button disabled={!validJuego} bsStyle="success" onClick={this.handleEdit}>Save Juego</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
};