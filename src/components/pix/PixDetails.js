import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import EditPix from './EditPix';

import apiServices from '../../services/api.service';

class PixDetails extends Component {
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

  // DELETE PIX:
  deletePix = async () => {
    try {
      const { params } = this.props.match;

      await apiServices.deletePixById(params.id);

      this.props.history.push('/pix');
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <div>
        <h1>{this.state.title}</h1>
        <p>{this.state.description}</p>
        {/* show the task heading only if there are tasks */}
        {this.state.tasks && this.state.tasks.length > 0 && <h3>Tasks </h3>}
        {/* map through the array of tasks and... */}
        {this.state.tasks &&
          this.state.tasks.map((task, index) => {
            return (
              <div key={index}>
                {/* ... make each task's title a link that goes to the task details page */}
                <Link to={`/tasks/${task._id}`}>{task.title}</Link>
              </div>
            );
          })}
        <div>
          {this.state.title && <EditPix thePix={this.state} {...this.props} />}
        </div>
        <button onClick={() => this.deletePix()}>Delete Pix</button>{' '}
        {/* <== !!! */}
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Link to={'/pix'}>Voltar Para Meus Pi</Link>
      </div>
    );
  }
}

export default PixDetails;
