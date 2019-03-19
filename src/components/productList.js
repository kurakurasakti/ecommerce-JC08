import React from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import Login from './Login'
import {connect} from 'react-redux'
import {Link, Redirect} from 'react-router-dom'
import { urlApi } from './../support/urlApi'
import './../support/css/product.css'

class ProductList extends React.Component{
    state = {
        listProduct : [],
        productData : {}
    }

    componentDidMount(){
        this.getDataProduct()
    }
    getDataProduct = () => {
        axios.get(urlApi + '/products')
        .then((res) => this.setState({listProduct : res.data}))
        .catch((err) => console.log(err))
    }
    getDataProductWithId = (id) => {
        alert(id)
        axios.get(urlApi + '/products/'+id)
        .then((res) => this.setState({productData : res.data}))
        .catch((err) => console.log(err))
        this.onBtnCart()
    }
    onBtnCart=()=>{
        if (this.props.anjing==="") {
            alert('To mas fikri, ini sudah pakai Redirect tapi tetep gamau ke redirect ke login.')
            return <Redirect to="/login"/>
        }
            var {nama, img, harga, diskon} = this.state.productData
            var qty = 1
            axios.post(urlApi + '/cart', {userId : this.props.kucing, namaProduct : nama, img, qty: qty, harga :harga, diskon: diskon })
            .then((res) => {
                swal('Add To Cart' , 'Success' , 'success')
                this.getDataProduct()
            }).catch((err) => {
                console.log(err)
            });
        
        
    }

    renderProdukJsx = () => {
        var jsx = this.state.listProduct.map((val) => {
            return (
                <div className="card col-md-3 mr-5 mt-3" style={{width: '18rem'}}>
                    <Link to={'/product-detail/' + val.id}><img className="card-img-top img" height='200px' src={val.img} alt="Card" /></Link>
                    
                    {/* { Pake if ternary (karena melakukan pengkondisian di dalam return)} */}


                    {   
                        val.discount > 0 ?
                        <div className='discount'>{val.discount}%</div>
                        : null
                    }
                    <div className="card-body">
                    <h4 className="card-text">{val.nama}</h4>

                    {
                        val.discount > 0 ?
                        <p className="card-text" style={{textDecoration:'line-through',color:'red',display:'inline'}}>Rp. {val.harga}</p>
                        : null
                    }

                    <p style={{display:'inline' , marginLeft:'10px',fontWeight:'500'}}>Rp. {val.harga - (val.harga*(val.discount/100))}</p>
                    <input type='button' onClick={()=> this.getDataProductWithId(val.id)} className='d-block btn btn-primary' value='Add To Cart' />
                    </div>
                </div>
            )
        })

        return jsx
    }
    render(){
        return(
            <div className='container'>
                <div className='row justify-content-center'>
                {this.renderProdukJsx()}
                </div>
            </div>
        )
    }
}


const mapStateToProps=(state) =>{
    return{
        kucing : state.user.id,
        anjing : state.user.username

    }
}
export default connect(mapStateToProps)(ProductList)

// var a = 3
// if(a > 0){
//     console.log('besar')
// }else if(a < 0) {
//     console.log('kecil')
// }else {
//     console.log('sedang')
// }   

// a > 0 ? console.log('besar') : a < 0 ? console.log('kecil') : console.log('sedang')