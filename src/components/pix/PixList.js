import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import AddPix from './AddPix';

import apiServices from '../../services/api.service';

class PixList extends Component {
  state = {
    listOfPix: [],
  };

  getAllPix = async () => {
    try {
      const pix = await apiServices.getAllPix();

      this.setState({ listOfPix: pix });
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.getAllPix();
  }

  render() {
    return (
      <div>
        <div style={{ width: '60%', float: 'left' }}>
          {this.state.listOfPix.map((pix) => {
            return (
              <div key={pix._id}>
                <Link to={`/pix/${pix._id}`}>
                  <h3>{pix.title}</h3>
                </Link>
                {/*  added so the tasks can be displayed:   */}
                <ul>
                  {pix.tasks.map((task, index) => {
                    return <li key={index}>{task.title}</li>;
                  })}
                </ul>
                {/* <p style={{maxWidth: '400px'}} >{pix.description} </p> */}
              </div>
            );
          })}
        </div>
        <div style={{ width: '40%', float: 'right' }}>
          <AddPix getData={() => this.getAllPix()} /> {/* <== !!! */}
        </div>
      </div>
    );
  }
}

export default PixList;
