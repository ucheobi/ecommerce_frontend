import React, { useState, useEffect} from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { createProduct, getCategories } from "./apiAdmin";


const AddProduct = () => {
    
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '',
        categories: [],
        category:'',
        shipping: '',
        quantity: '',
        photo: '',
        loading: false,
        error: '',
        createdProduct: '',
        redirectToProfile: false,
        formData: ''
    })
    
    const {user, token} = isAuthenticated();
    const {
        name,
        description,
        price,
        categories,
        category,
        shipping,
        quantity,
        loading,
        error,
        createdProduct,
        redirectToProfile,
        formData
    } = values;

    const init = () => {
        getCategories().then(data => {
            if(data.error){
                setValues({...values, error: data.error})
            } else {
                setValues({...values, categories: data, formData: new FormData() })
            }
        })
    }

    useEffect(() => {
        init();
    }, [])

    const handleChange = name => event => {
        const value = 
            name === 'photo' 
            ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({...values, [name]: value})
    }

    const clickSubmit = (event) => {
        event.preventDefault()
        setValues({...values, error: '', loading: true}) 
        
        createProduct(user._id, token, formData)
            .then(data => {
                if(data.error){
                    setValues({...values, error: data.error});
                } else {                   
                    setValues({
                        ...values,
                        name: "",
                        description: "",
                        photo: "",
                        price: "",
                        quantity: "",
                        loading: false,
                        createdProduct: data.name
                    })
                }
        })
    }

    const productForm = () => (
        <form className="mb-3" onSubmit={clickSubmit}>
            <h4>Post Photo</h4>
            <div className="form-group">
                <label className="btn btn-secondary">
                    <input 
                        type="file" 
                        onChange={handleChange('photo')} 
                        name="photo" 
                        accept="image/*" 
                    />
                </label>
            </div>

            <div className="form-group">
                <label className="text-muted">Name</label>
                <input 
                    type="text" 
                    onChange={handleChange('name')} 
                    className="form-control"
                    value={name}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Description</label>
                <textarea 
                    onChange={handleChange('description')} 
                    className="form-control"
                    value={description}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Price</label>
                <input 
                    onChange={handleChange('price')} 
                    className="form-control"
                    type="number"
                    value={price}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Category</label>
                <select 
                    onChange={handleChange('category')} 
                    className="form-control"
                >
                    <option>Please select</option>

                   {categories && categories.map((c, i) => (
                       <option key={i} value={c._id}>{c.name}</option>
                   ))}
                </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Shipping</label>
                <select 
                    onChange={handleChange('shipping')} 
                    className="form-control"
                >
                    <option>Please select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                </select>
            </div>


            <div className="form-group">
                <label className="text-muted">Quantity</label>
                <input 
                    type="number" 
                    onChange={handleChange('quantity')} 
                    className="form-control"
                    value={quantity}
                />
            </div>

            <button className="btn btn-outline-primary">Create Product</button>
        </form>
    )

    const showError = () => (
        <div className="alert alert-danger" style={{display: error ? '' : "none"}}>
            {error}
        </div>
    )

    const showSuccess = () => (
        <div className="alert alert-info" style={{display: createdProduct ? "" : "none"}}>
            <h2>{`${createProduct}`}has been created</h2>
        </div>
    )

    const showLoading = () => 
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        )

    return (
    
        <Layout 
            title="Add a new product" 
            description={`Good Day ${user.name}, you can add a new product here`} 
        >
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                   {productForm()}
                </div>
            </div>
            
        </Layout>
    )
}

export default AddProduct;