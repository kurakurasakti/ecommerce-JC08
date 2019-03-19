/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import {Redirect} from 'react-router-dom'
import { Table, Button } from 'reactstrap';
import { urlApi } from './../support/urlApi';
import swal from 'sweetalert'
import { connect } from 'react-redux'
import PageNotFound from './../components/pageNotFound'

class Cart extends React.Component{
    state = {
        rows: [],
        totalBelanjax : 0,
        page: 0,
        rowsPerPage: 5,
        isEdit : false,
        editItem : {},
      };
    
    componentDidMount(){
        this.getDataApi()
        this.totalBelanja()
    }

    

    onBtnHome=()=>{
        alert('function sudah sesuai tapi tidak bisa Redirect')
        return <Redirect to='/'/>
    }

    totalBelanja=()=>{
        var tBelanja = 0
        Axios.get(urlApi+'/cart?userId='+this.props.kucing)
        .then((res) => {
            if (res.data.length>0) {    
                for (let i = 0; i < res.data.length; i++) {
                    tBelanja += res.data[i].harga*res.data[i].qty-(res.data[i].harga*res.data[i].diskon/100)
                     
                }
            return this.setState({totalBelanjax : tBelanja})

            }
        }).catch((err) => {
            console.log(err);
        });
        
    }
    onChangeQty=(pharam)=>{
        this.setState({editItem : pharam})
        Axios.get(urlApi+'/cart/'+this.state.editItem.id)
        .then((res) => {
            if (res.data>0) {
                var namaProduct = this.state.editItem.namaProduct
                var img = this.state.editItem.img
                var qty = this.refs.inputQty.value
                var harga = this.state.editItem.harga
                var diskon = this.state.editItem.diskon
                var newData = {
                    namaProduct,
                    img,
                    qty,
                    harga,
                    diskon
                }
                Axios.put(urlApi+'/cart/'+this.state.editItem.id,newData)
                .then((res) => {
                    this.getDataApi()
                }).catch((err) => {
                    console.log(err)
                });
            }
        }).catch((err) => {
            console.log(err)
        });
        
    }

    getDataApi =() => {
        alert('masauk dat api')
        Axios.get(urlApi + '/cart?userId='+this.props.kucing)
        .then((res) => this.setState({rows : res.data}))
        .catch((err) => console.log(err))
    }

    getAlldataCart = () => {
        var arr = []
        for(var i = 0 ; i< this.state.rows.length ; i++){
            var newData = {
                namaProduct: this.state.rows[i].namaProduct,
                img : this.state.rows[i].img,
                qty : this.state.rows[i].qty,
                harga : this.state.rows[i].harga,
                diskon : this.state.rows[i].diskon
            }
            arr.push(newData)
        }
        return arr
    }

    emptyCart=()=>{
        Axios.get((urlApi + '/cart?userId='+this.props.kucing))
        .then((res) => {
            if (res.data.length>0){
                for (var i=0; i<this.state.rows.length;i++){
                    Axios.delete(urlApi+"/cart/"+this.state.rows[i].id)
                    .then((res)=>{console.log(res)
                    this.getDataApi()
              
                    })
                }
            }
        })
    }

    onBtnCheckout=()=>{
        var dte = new Date()
        var dd = dte.getDate()
        var mm = dte.getMonth()
        var yyyy = dte.getFullYear()
        var today = dd+'-'+mm+'-'+yyyy
        var userId = this.props.kucing
        Axios.get((urlApi + '/cart?userId='+this.props.kucing))
        .then((res) => {
            if (res.data.length>0){
                var totHarga = 0
                for (var i=0; i<this.state.rows.length;i++){
                    totHarga += (res.data[i].qty * (res.data[i].harga - (res.data[i].harga*res.data[i].diskon/100)))
                }
                var newData = {
                    userId,transactionDetail:this.getAlldataCart(),transactionDate:today,total : totHarga
                    
                }
                Axios.post(urlApi+"/transaction/",newData)
                .then((res)=>{
                  swal("Thank you","Please Come Again","success")
                  this.emptyCart()
                })
                .catch((err)=>console.log(err))
            
            }
        }).catch((err) => {
            console.log(err);
        })
        
        // Axios.post(urlApi + '/transaction',)
        
    }

    onBtnDelete=(id)=>{
        Axios.delete(urlApi +'/cart/'+ id)
        .then((res) => {
        this.getDataApi()
        })
      .catch((err) => console.log(err))
    }

    renderJsx=()=>{
        var jsx =  this.state.rows.slice(this.state.page * this.state.rowsPerPage,  this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
    .map((val) => {
        return (
                <tbody>
                    <tr>
                      <th><img src={val.img} width='50px'/></th>
                      <td>{val.namaProduct}</td>
                      <td><input ref='inputQty' onChange={()=> this.onChangeQty(val)} type="number" value={val.qty}/>x</td>
                      <td>@ Rp {val.harga}</td>
                      <td onClick={()=> this.onBtnDelete(val.id)}><i class="fas fa-times"></i></td>
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
                {this.state.rows.length>0
                ?<div>
                <Table>
                    <thead>
                        <tr>
                          <th>Product</th>
                          <th></th>
                          <th></th>
                          <th>Total</th>

                        </tr>
                    </thead>
                    {this.renderJsx()}
                </Table>

                    <div className="mt-3">
                        <Button color="success" onClick={this.onBtnCheckout}>
                        Checkout
                        </Button>
                    </div>
                        <div className="mt-3">
                        <h1>Total Belanja Anda {this.state.totalBelanjax}</h1>
                    </div>
                    </div>
                :
                <div className="container">
                    <Button color="success" onClick={this.onBtnHome}>
                        Tidak ada barang di cart, Press here to home!
                        
                    </Button>
                </div>
                }
                
                
                   
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
export default connect(mapStateToProps)(Cart)
