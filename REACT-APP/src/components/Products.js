import React, { Component } from 'react';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { IconButton, Input, FormControl, InputLabel, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import io from 'socket.io-client';

const APIUrl = "http://localhost:8888/api/products/";
const socketUrl = "http://localhost:8888/";
const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
        paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    button: {
        width: '100%',
        marginTop: '10px',
    },
}));

class Products extends Component {

    constructor(props) {
        super(props)
        this.state = {
            products: [],
            productNew: {
                name: "",
                type: "",
                price: "",
                rating: "",
                warranty_years: "",
                available: false
            },
            productShow: {
                name: "",
                type: "",
                price: "",
                rating: "",
                warranty_years: "",
                available: false
            },
            productEdit: {
                _id: "",
                name: "",
                type: "",
                price: "",
                rating: "",
                warranty_years: "",
                available: false
            },
            open: true,
            showProductModal: false,
            newProductModal: false,
            editProductModal: false,
            socket: io(socketUrl)
        }
    }

    // GET ALL PRODUCTS
    getProducts = () => {
        fetch(APIUrl + "get")
        .then(res => {
            if (res.status !== 200) {
                throw res.json()
            }
            return res.json()
        })
        .then((data) => {            
            this.setState({
                products: data
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    // ADD A PRODUCT
    addProduct = () => {
        let data = this.state.productNew;
        let params = "?name="+data.name+"&type="+data.type+"&price="+data.price+"&warranty_years="+data.warranty_years+"&rating="+data.rating+"&available="+data.available;
        
        fetch(APIUrl + "create" + params)
        .then(res => {
            if (res.status !== 200) {
                throw res.json()
            }
        })
        .then(() => {
            this.getProducts();
            this.setState({
                productNew: {
                    name: "",
                    type: "",
                    price: "",
                    rating: "",
                    warranty_years: "",
                    available: false
                },
            });
        })
        .then(() => {
            this.state.socket.emit("updateProducts");
        })
        .catch((error) => {
            console.log(error);
        });
    }

    // MODIFY A PRODUCT
    modifyProduct = () => {
        let data = this.state.productEdit;
        let params = "?id="+data._id+"&name="+data.name+"&type="+data.type+"&price="+data.price+"&warranty_years="+data.warranty_years+"&rating="+data.rating+"&available="+data.available;

        fetch(APIUrl + "modify" + params)
        .then(res => {
            if (res.status !== 200) {
                throw res.json()
            }
        })
        .then(() => {
            this.getProducts();
        })
        .then(() => {
            this.state.socket.emit("updateProducts");
        })
        .catch((error) => {
            console.log(error);
        });
    }

    // DELETE A PRODUCT
    deleteProduct = (req) => {
        let data = req.id;
        let params = "?id="+data;
        
        fetch(APIUrl + "remove" + params)
        .then(() => {
            this.getProducts();
            this.setState({
                showProductModal: false
            });
        })
        .then(() => {
            this.state.socket.emit("updateProducts");
        })
        .catch((error) => {
            console.log(error);
        });
    }
    
    // Load products on first connection
    componentDidMount() {
        this.getProducts();
        this.state.socket.on('updateClientProducts', this.getProducts);
    }
    
    // RENDER PRODUCTS
    render () {
        // Get all state values
        const open = this.state.open;
        const showProductModal = this.state.showProductModal;
        const editProductModal = this.state.editProductModal;
        const newProductModal = this.state.newProductModal;
        const productShow = this.state.productShow;
        const productEdit = this.state.productEdit;
        const productNew = this.state.productNew;
        const products = this.state.products;
        let types = [];

        // List types. if   : products = [{type: "phone"}, {type:"phone"}, {type:"tv"}]
        //             then : types = ["phone", "tv"]
        products.forEach(product => {
            if (!types.includes(product.type)) {
                types.push(product.type);
            }
        });

        // close/open lists
        const openCloseList = () => {
            this.setState({open: !open});
        }

        // close Modal: Info of product
        const handleCloseShowModal = () => {
            this.setState({showProductModal: false});
        }

        // close Modal: Edite a product
        const handleCloseEditModal = () => {
            this.setState({editProductModal: false});
        }

        // close Modal: Create a product
        const handleCloseNewModal = () => {
            this.setState({newProductModal: false});
        }

        // Return the product in relation to its id
        function getProductById(id) {
            let product = null;
            products.forEach(element => {            
                if (element._id === id) {
                    product = element;
                }
            });
            return (product);
        }

        // Open Modal: Info of Product
        const showProduct = (id) => {
            let product = getProductById(id);
            
            this.setState( { 
                    productShow : {
                        _id: product._id,
                        name: product.name,
                        type: product.type,
                        price: product.price,
                        rating: product.rating,
                        warranty_years: product.warranty_years,
                        available: product.available
                    }
                }
            )
            this.setState({showProductModal: true});
        }

        // Open Modal: Edite a product
        const editProduct = (id) => {
            let product = getProductById(id);
            
            this.setState( { 
                    productEdit : {
                        _id: product._id,
                        name: product.name,
                        type: product.type,
                        price: product.price,
                        rating: product.rating,
                        warranty_years: product.warranty_years,
                        available: product.available
                    }
                }
            )
            this.setState({editProductModal: true});
        }

        // Create the list containing all products sorted by type
        let categories = types.map(type => {
            let productsMap = products.map(product => {
                if (product.type === type) {
                    return (
                        <ListItem key={product._id} button>
                            <ListItemText primary={product.name} onClick={showProduct.bind(null, product._id)}/>
                            <IconButton aria-label="delete" onClick={editProduct.bind(null, product._id)}>
                                <EditIcon />
                            </IconButton>
                        </ListItem>
                    );
                }
                return null;
            });
            return (
                <div key={types.indexOf(type)}>
                    <ListItem button onClick={openCloseList}>
                        <ListItemText primary={type} />
                       {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {productsMap}
                        </List>
                    </Collapse>
                </div>
            );
        });

        // Create the Modal containing info of product
        const MyModalShowProduct = () => {
            const classes = useStyles();
            return (
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={showProductModal}
                    onClose={handleCloseShowModal}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                >
                    <Fade in={showProductModal}>
                    <div className={classes.paper}>
                        <h2>{productShow.name}</h2>
                        <p>Type: <b>{productShow.type}</b></p>
                        <p>Price: <b>{productShow.price}</b></p>
                        <p>Rating: <b>{productShow.rating}</b></p>
                        <p>Warranty years: <b>{productShow.warranty_years}</b></p>
                        <p>Available: <b>{productShow.available === true || productShow.available === "true" ? "yes" : "no"}</b></p>
                        <Button aria-label="delete" variant="contained" color="secondary" className={classes.button} onClick={this.deleteProduct.bind(null, {id: productShow._id})}>
                            Delete
                            <DeleteIcon className={classes.rightIcon} />
                        </Button>
                    </div>
                    </Fade>
                </Modal>
            );
        }

        // Create the Modal containing info of product to edit
        const MyModalEditProduct = () => {
            const classes = useStyles();
            return (
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={editProductModal}
                    onClose={handleCloseEditModal}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                >
                    <Fade in={editProductModal}>
                    <div className={classes.paper}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="component-simple">Name</InputLabel>
                            <Input id="component-simple" value={productEdit.name} onChange={(e) => {
                                        let {productEdit} = this.state;

                                        productEdit.name = e.target.value;

                                        this.setState({ productEdit });
                                    }} />
                        </FormControl><br />
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="component-simple">Type</InputLabel>
                            <Input id="component-simple" value={productEdit.type} onChange={(e) => {
                                        let {productEdit} = this.state;

                                        productEdit.type = e.target.value;

                                        this.setState({ productEdit });
                                    }} />
                        </FormControl><br />
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="component-simple">Price</InputLabel>
                            <Input id="component-simple" value={productEdit.price} onChange={(e) => {
                                        let {productEdit} = this.state;

                                        productEdit.price = e.target.value;

                                        this.setState({ productEdit });
                                    }} />
                        </FormControl><br />
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="component-simple">Rating</InputLabel>
                            <Input id="component-simple" value={productEdit.rating} onChange={(e) => {
                                        let {productEdit} = this.state;

                                        productEdit.rating = e.target.value;

                                        this.setState({ productEdit });
                                    }
                                } />
                        </FormControl><br />
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="component-simple">Warranty years</InputLabel>
                            <Input id="component-simple" value={productEdit.warranty_years} onChange={(e) => {
                                        let {productEdit} = this.state;

                                        productEdit.warranty_years = e.target.value;

                                        this.setState({ productEdit });
                                    }} />
                        </FormControl><br />
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="component-simple">Available</InputLabel>
                            <Input id="component-simple" value={productEdit.available} onChange={(e) => {
                                        let {productEdit} = this.state;

                                        productEdit.available = e.target.value;

                                        this.setState({ productEdit })
                                    }}/>
                        </FormControl><br />
                        <Button aria-label="edit" variant="contained" color="primary" className={classes.button} onClick={this.modifyProduct}>
                            edit
                            <EditIcon className={classes.rightIcon} />
                        </Button>
                    </div>
                    </Fade>
                </Modal>
            );
        }

        // Create the Modal to create/add a new product
        const MyModalNewProduct = () => {
            const classes = useStyles();
            return (
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={newProductModal}
                    onClose={handleCloseNewModal}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                >
                    <Fade in={newProductModal}>
                    <div className={classes.paper}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="component-simple">Name</InputLabel>
                            <Input 
                                id="component-simple"
                                value={productNew.name}
                                onChange={
                                    (e) => {
                                        let {productNew} = this.state;

                                        productNew.name = e.target.value;

                                        e.preventDefault();
                                        this.setState( {productNew} );
                                    }
                                } 
                            />
                        </FormControl><br />
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="component-simple">Type</InputLabel>
                            <Input id="component-simple" value={productNew.type} onChange={(e) => {
                                        let {productNew} = this.state;

                                        productNew.type = e.target.value;

                                        this.setState({ productNew });
                                    }} />
                        </FormControl><br />
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="component-simple">Price</InputLabel>
                            <Input id="component-simple" value={productNew.price} onChange={(e) => {
                                        let {productNew} = this.state;

                                        productNew.price = e.target.value;

                                        this.setState({ productNew });
                                    }} />
                        </FormControl><br />
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="component-simple">Rating</InputLabel>
                            <Input id="component-simple" value={productNew.rating} onChange={(e) => {
                                        let {productNew} = this.state;

                                        productNew.rating = e.target.value;

                                        this.setState({ productNew });
                                    }
                                } />
                        </FormControl><br />
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="component-simple">Warranty years</InputLabel>
                            <Input id="component-simple" value={productNew.warranty_years} onChange={(e) => {
                                        let {productNew} = this.state;

                                        productNew.warranty_years = e.target.value;

                                        this.setState({ productNew });
                                    }} />
                        </FormControl><br />
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="component-simple">Available</InputLabel>
                            <Input id="component-simple" value={productNew.available} onChange={(e) => {
                                        let {productNew} = this.state;

                                        productNew.available = e.target.value;

                                        this.setState({ productNew })
                                    }}/>
                        </FormControl><br />
                        <Button aria-label="create" variant="contained" color="primary" className={classes.button} onClick={this.addProduct}>
                            create
                            <AddIcon className={classes.rightIcon} />
                        </Button>
                    </div>
                    </Fade>
                </Modal>
            );
        }

        return (
            <div>
                <MyModalShowProduct />
                <MyModalEditProduct />
                <MyModalNewProduct />
                <List
                    component="nav"
                    aria-labelledby="products"
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                        Products
                        </ListSubheader>
                    }
                >
                    <Button onClick={e => {
                            this.setState({newProductModal: true})
                        }
                    }>
                        add product
                    </Button>
                    {categories}
                </List>
            </div>
        );
    }
}

export default Products;
