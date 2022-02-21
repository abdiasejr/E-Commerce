import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
} from "@mui/material";
import { AddShoppingCart } from "@mui/icons-material";
import useStyles from "../helpers/stylesProduct";
import {Link} from 'react-router-dom';

const Product = ({ id,name,price,section,description }) => {
  const classes = useStyles();
  return (
    <Link to={`/productDetail/${id}`} style={{textDecoration:'none'}}>
    <Card className={classes.root}>
<<<<<<< HEAD
      <CardMedia className={classes.media} image={`${product.image}`} title={product.name} />
=======
      <CardMedia className={classes.media} image="https://picsum.photos/200" title={name} />
>>>>>>> fe3aa24a30d64ee5d053f2048829542ecd6c193c
      <CardContent>
        <div className={classes.cardContent}>
          <Typography variant="h5">{name}</Typography>
          <Typography variant="body2">{price}</Typography>
        </div>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
        <CardActions className={classes.cardActions}>
          <IconButton aria-label="Add to cart">
            <AddShoppingCart />
          </IconButton>
        </CardActions>
      </CardContent>
    </Card>
    </Link>
  );
};

export default Product;
