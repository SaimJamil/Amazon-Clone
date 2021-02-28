import React from 'react'
import './Payment.css'
import { useStateValue } from './StateProvider';
import CheckoutProduct from "./CheckoutProduct";
import {Link,useHistory} from 'react-router-dom';
import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js';
import {useState, useEffect} from 'react';
import { getBasketTotal } from './Reducer';
import CurrencyFormat from 'react-currency-format';
import axios from './Axios'
import {db} from './firebase'
function Payment() {
    const [{basket,user},dispatch]=useStateValue();

    const stripe=useStripe();
    const elements=useElements();

    const history=useHistory();
    const [error, setError] = useState(null)
    const [disabled, setDisabled] = useState(true)
    const [succeeded, setSucceeded] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [clientSecret, setClientSecret] = useState(true)

    useEffect(() => {
        const getClientSecret= async ()=>{
            const response= await axios(
                {
                    method:'post',
                    url :`/payments/create?total=${getBasketTotal(basket)*100}`
                }
            );
            setClientSecret(response.data.clientSecret);
        }
        getClientSecret();
    }, [basket])

    const handleSubmit= async e=>{
        e.preventDefault();
        setProcessing(true);
        console.log('client secret',elements.getElement(CardElement));
        const payload= await stripe.confirmCardPayment(clientSecret,{
            payment_method:{
                card:elements.getElement(CardElement)
            }
        }).then(({paymentIntent})=>
        {
            db
            .collection('users')
            .doc(user?.uid)
            .collection('orders')
            .doc(paymentIntent.id)
            .set({
                basket: basket,
                amount:paymentIntent.amount,
                created:paymentIntent.created
            });


            setSucceeded(true);
            setError(null);
            setProcessing(false);
            dispatch({
                type:'EMPTY_BASKET'
            })
            history.replace('/orders')
        })
    }

    const handleChange = async (e)=>{
        setDisabled(e.empty);
        setError(e.error?e.error.message:"");
    }

    return (
        <div className="payment">
            <div className="payment_container">

                <h1>
                    Checkout (<Link to="/checkout">{basket?.length} items</Link>)
                </h1>
                <div className="payment_section">
                    <div className="payment_title">
                        <h3>Delivery Address</h3>
                    </div>
                    <div className="payment_address">
                        <p>{user?.email}</p>
                        <p>123 React Lane</p>
                        <p>NewYork, USA</p>
                    </div>
                </div>
                <div className="payment_section">
                    <div className="payment_title">
                        <h3>Review Items and Delivery</h3>
                    </div>
                    <div className="payment_items">
                        { basket.map(item => (
                            <CheckoutProduct
                            id={item.id}
                            title={item.title}
                            image={item.image}
                            price={item.price}
                            rating={item.rating}
                        />
                        ))}
                    </div>
                </div>
                <div className="payment_section">
                    <div className="payment_title">
                        <h3>Payment Method</h3>
                    </div>
                    <div className="payment_details">
                        <form onSubmit={handleSubmit}>
                            <CardElement onChange={handleChange}/>
                            <div className="payment_priceContainer">
                            <CurrencyFormat
                                renderText={(value) => (
                                <>
                                    <h3>Order Total : {value}</h3>
                                </>
                                )}
                                decimalScale={2}
                                value={getBasketTotal(basket)} // Part of the homework
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"$"}
                            />
                            <button disabled={processing ||disabled || succeeded} type="submit">
                                <span>
                                    {processing?<p>Processing</p>:"Buy Now"}
                                </span>
                            </button>
                            </div>
                            {error && <div>{error}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment
