import React from "react";
import { useEffect } from "react";

/* import Button from "react-bootstrap/Button";
import CardGroup from "react-bootstrap/CardGroup";
import Card from "react-bootstrap/Card"; */
import Conntainer from "react-bootstrap/Container";
import Carousel from "react-bootstrap/Carousel";

/* import Holder from "react-holder";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col"; */
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import { Footer, NavBar } from ".";
/* 
import ProducsTest from "./Utilitis/producsTest.json"; */

import { useDispatch, useSelector } from "react-redux";
import { getProductsPublic } from "./../Redux/Actions/actions"; /* 
import DisplayItemsHome from '../containers/ItemsDisplayHome/ProductsPresentHome'
import products from "../helpers/mockProducts"; */

export default function Home() {
  /* const [producs, SetProducts] = useState(Object.values(ProducsTest));

  const [ValueRandom, SetValueRandom] = useState([]); */

  let { products } = useSelector((state) => state.products);
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getProductsPublic());
  }, []);

  useEffect(() => {
    console.log(products);
  }, [products]);

  return (
    <div>
      {/* <h1>HOME</h1> */}
      <NavBar />
      <Conntainer>
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://cdn.pixabay.com/photo/2020/01/24/13/26/camera-4790247_960_720.jpg"
              alt="First slide"
            />
            <Carousel.Caption
              style={{
                transform: "scale(1, 2)",
              }}
            >
              <h3>Go pro Started</h3>
              <p>Precio: 160.00$</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://cdn.pixabay.com/photo/2016/10/04/22/11/gopro-1715601_960_720.jpg"
              alt="Second slide"
            />

            <Carousel.Caption
              style={{
                transform: "scale(1, 2)",
              }}
            >
              <h3>Kodad con reflex 2.3</h3>
              <p>Precio: 200.00$</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://cdn.pixabay.com/photo/2019/01/24/23/54/nintendo-switch-3953601_960_720.jpg"
              alt="Third slide"
            />

            <Carousel.Caption
              style={{
                transform: "scale(1, 2)",
              }}
            >
              <h3>nintendo-switch lite</h3>
              <p>Precio: 180.00$</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </Conntainer>

      {
        // ------------------------------
      }

      {/* {products?.length > 0 && <DisplayItemsHome items={products}/>} */}

      <br />
      <Container>
        <Image
          variant="top"
          src={"https://i.ibb.co/gDTGrKc/airport-g048af3c6f-1280.jpg"}
          style={{
            position: "relative",
            right: "75px",
            top: "15px",
            transform: "scale(1, 0.8)",
          }}
        />

        <br />
      </Container>
      <Footer />
    </div>
  );
}
