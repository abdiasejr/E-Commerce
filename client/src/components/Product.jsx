import React from "react";
import { Link } from "react-router-dom";
import { MdAddShoppingCart } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { addCartItem } from "../Redux/Actions/actions";

const Product = ({ product }) => {
  const { session } = useSelector((state) => state.shopping);
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(addCartItem(session.id, product.id));
  };
  
  return (
    <div className="product--item">
      <Link to={`/product/${product.id}`} className="product--link">
        <div className="product--image" style={{backgroundImage: `url(${product.image})`}} />
        <p className="product--title"> {product.name} </p>
        <p className="product--info"> {product.description}</p>
      </Link>
      <div className="product--price-container">
        <p className="product--price"> $ {product.price} </p>
        <MdAddShoppingCart className="product--cart-icon" onClick={handleClick}/>
      </div>
    </div>
  );
};

export default Product;
