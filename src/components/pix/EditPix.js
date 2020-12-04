import React, { Component } from 'react';

import apiServices from '../../services/api.service';

class EditPix extends Component {
  state = {};

  componentDidMount() {
    this.getSinglePix();
  }

  getSinglePix = async () => {
    try {
      const { params } = this.props.match;

      const pix = await apiServices.getOnePixById(params.id);

      this.setState(pix);
    } catch (error) {
      console.log(error);
    }
  };
  
  handleFormSubmit = async (event) => {
    try {
      event.preventDefault();

      const { key, agency, id } = this.state;

      await apiServices.editPixById(id, { key, agency });

      this.props.history.push('/pix');
    } catch (error) {
      console.log(error);
    }
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  render() {
    console.log('RENDERIZADO EDIT Pix');
    return (
      <div>
        <hr />
        <h3>Edit form</h3>
        <form onSubmit={this.handleFormSubmit}>
          <label>Chave:</label>
          <input
            type="text"
            name="title"
            value={this.state.key}
            onChange={(e) => this.handleChange(e)}
          />
          <label>Agencia:</label>
          <textarea
            name="description"
            value={this.state.agency}
            onChange={(e) => this.handleChange(e)}
          />

          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default EditPix;
