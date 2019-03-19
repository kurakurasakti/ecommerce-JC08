/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { urlApi } from './../support/urlApi';
import { connect } from 'react-redux'
import PageNotFound from './pageNotFound'
import { Table, Collapse, CardBody, Card } from 'reactstrap';

class TrxHistory extends React.Component{
    
    state = {
        rows: [],
        page: 0,
        rowsPerPage: 5,
        isEdit : false,
        editItem : {},
        rowsDetail :[]
      };
    
    componentDidMount(){
        this.getDataApi()
        
    }

    getDataApi =() => {
        Axios.get(urlApi + '/transaction?userId='+this.props.kucing)
        .then((res) => this.setState({rows : res.data}))
        .catch((err) => console.log(err))
    }

    getTrxDetails=()=>{
        var arr = []
        for (let i = 0; i < this.state.rows.length; i++) {
            var trxdetail = this.state.rows[i].transactionDetail
            arr.push(trxdetail)
        }
        this.setState({rowsDetail : arr})
    }

    renderDetail=()=>{
        var jsx =  this.state.rowsDetail.slice(this.state.page * this.state.rowsPerPage,  this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
    .map((val) => {
        return (
                <tbody>
                    <tr>
                        <td>{val.namaProduct}</td>
                        <td>{val.img}</td>
                        <td>{val.qty}</td>
                        <td>{val.harga}</td>
                        <td>{val.diskon}</td>
                    </tr>
                </tbody>
        )
    })
    return jsx
    }

    renderJsx=()=>{
        var jsx =  this.state.rows.slice(this.state.page * this.state.rowsPerPage,  this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
    .map((val) => {
        return (
                <tbody>
                    <tr>
                      <td>{val.id}</td>
                      <td>{val.transactionDate}</td>
                      {/* <td><Link onClick={this.getTrxDetails()}>See Details</Link></td>
                      <td>{this.renderDetail()}</td> */}
                      {/* saya udh coba mas, tapi gabisa get data detailnya. function nya ada di atas, mduah"An ada nilai kasian :(  */}
                      <td>{val.total}</td>
                    </tr>
                </tbody>
        )
    })
    return jsx
    }

    render(){
        if (this.props.kucing !== 0) {
            return(
                <div className="container col-md-5">
                <h3>Transaction History</h3>
                    <Table>
                        <thead>
                            <tr>
                              <th>Id Transaksi</th>
                              <th>Tanggal</th>
                              <th></th>
                              <th></th>
                              
                            </tr>
                        </thead>
                        {this.renderJsx()}
                    </Table>
    
                    <div class="mt-5">
                        
                    </div>
                </div>
            )
        }
        else{
            return <PageNotFound/>
        }
        
    }
}

const mapStateToProps=(state) =>{
    return{
        kucing : state.user.id

    }
}
export default connect(mapStateToProps)(TrxHistory)
