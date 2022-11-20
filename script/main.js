var eventBus = new Vue()

// Product display component. Contains information for each product variant.
Vue.component('product', {

    template: `
        <div id="product">
            <div class="row pb-5">
                <div class="product-image col-md pb-3">
                    <img :src="image" :alt="alt" style="max-width:100%; object-fit:contain" />
                    <div style="display:block">
                        <div v-for="(variant, index) in variants" :key="variant.variantId" style="display:inline-block">
                            <div class="color-box" 
                                :style="{ backgroundColor: variant.variantBg }"
                                :class="{ colorBoxSelected : variant.variantId === currentId}"
                                @click="updateProduct(index)">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="product-info col-md">
                    <h1>{{ title }}</h1>
                    <h2 class="d-inline-block pe-3">{{ currPrice }}</h2>
                    <p v-if="inStock" :class="{ 'btn btn-success': inStock }" class="d-inline-block">In Stock</p>
                    <p v-else :class="{ 'noStock btn btn-danger disabled': !inStock }" class="d-inline-block">Out of Stock</p>
                    <h2>Details</h2>
                    <ul>
                        <li v-for="detail in details">{{ detail }}</li>
                    </ul>
                    <br />
                    <h2>Care Instructions</h2>
                    <p>Leather is a natural material and it can display natural marking and colour variations. 
                        Over time, the leather will soften with the oils from your dog's coat, developing a natural patina. 
                        With a bit of love and care, leather ages gracefully! Give it the occasional clean and recondition 
                        with leather dressing, and it will reward you with many years of service. Avoid getting it saturated 
                        with water as this can cause the leather to become brittle and more likely to break. For dogs that love 
                        to swim, we recommend keeping a secondary, waterproof collar for water-based outings. If your leather leash 
                        does get wet, allow it to dry naturally and then recondition with a good quality leather dressing.
                    </p>
                    <br />
                    <button @click="addToCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }" 
                    class="btn btn-primary">
                    <i class="fa-solid fa-cart-shopping fa-sm"></i> Add to cart </button>
                </div>
            </div>
            <product-tabs :reviews="reviews"></product-tabs>
        </div>
    `,
    data() {
        return {
            product: "Premium Leather Leash",
            brand: "Fox",
            selectedVariant: 0,
            alt: "Leather leash",
            details: ["Genuine leather", "Solid brass fittings", '122cm / 4 feet long, 1" wide', "Available in a range of colours", "Hand-made to order"],

            filepath: "./img/leashes/leash-",
            
            // Array of product variants, used to build the colour dots, change the active image, and pass information to the cart
            variants: [
                {
                    variantId: 101,
                    variantColor: "brown",
                    variantQuantity: 10,
                    variantPrice: 65,
                    variantBg: "#713910"
                },
                {
                    variantId: 102,
                    variantColor: "tan",
                    variantQuantity: 12,
                    variantPrice: 65,
                    variantBg: "#bf8d5d"
                },
                {
                    variantId: 103,
                    variantColor: "black",
                    variantQuantity: 7,
                    variantPrice: 70,
                    variantBg: "#1b1b1b"
                },
                {
                    variantId: 104,
                    variantColor: "green",
                    variantQuantity: 3,
                    variantPrice: 75,
                    variantBg: "#00713f"
                },
                {
                    variantId: 105,
                    variantColor: "blue",
                    variantQuantity: 5,
                    variantPrice: 75,
                    variantBg: "#003b78"
                },
                {
                    variantId: 106,
                    variantColor: "magenta",
                    variantQuantity: 0,
                    variantPrice: 80,
                    variantBg: "#95094e"
                },
                {
                    variantId: 107,
                    variantColor: "red",
                    variantQuantity: 6,
                    variantPrice: 100,
                    variantBg: "#ff3636"
                },
            ],
            reviews: [],

        }
    },

    methods: {
        // Builds a cart item out of item information and adds it to cart array
        addToCart() {
            let cartItem = {
                product: this.product,
                variant: this.variants[this.selectedVariant].variantId,
                color: this.variants[this.selectedVariant].variantColor,
                price: this.variants[this.selectedVariant].variantPrice,
            }

            this.$emit('add-to-cart', cartItem)
        },

        // Changes product image to selected product
        updateProduct(index) {
            this.selectedVariant = index
        },
        
    },


    computed: {
        title() {
            return this.brand + ' ' + this.product
        },

        // Used to retrieve information about the currently active variant
        currPrice() {
            return '$' + this.variants[this.selectedVariant].variantPrice
        },

        image() {
            return this.filepath + this.variants[this.selectedVariant].variantColor + '.jpg'
        },

        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },

        currentColor() {
            return this.variants[this.selectedVariant].variantColor
        },

        currentId () {
            return this.variants[this.selectedVariant].variantId
        }
    },

    // Receives product review from the product-review component and adds it to the array to be pushed to tabs for display
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})

Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <div v-if="errors.length" class="alert alert-danger">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors">{{ error }}</li>
                </ul>
            </div>
            <p>
                <label for="name" class="form-label">Name:</label>
                <input id="name" v-model="name" placeholder="Name" class="form-control">
            </p>
            <p>
                <label for="review" class="form-label">Review:</label>
                <textarea id="review" v-model="review" class="form-control"></textarea>
            </p>

            <p>
                <label for="rating" class="form-label">Rating:</label>
                <select id="rating" v-model.number="rating" class="form-select">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>
            
            <p>
                <input type="submit" value="Submit" class="btn btn-primary">
            </p>
        </form>
    `,

    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },

    methods: {
        // Process review form and push it to the event bus so other components can read it on submit
        onSubmit() {
            this.errors = [];

            if(this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null

            // Check if any form entries are blank and report errors
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
            }
        }
    }
})

Vue.component('product-tabs', {
    template: `
        <div>
            <div>
                <ul class="nav nav-tabs">   
                    <li class="tab nav-item" 
                        v-for="(tab, index) in tabs" 
                        @click="selectedTab = tab">
                            <a class="nav-link" :class="{ active: selectedTab === tab }">{{ tab }}</a>
                    </li>
                </ul>
            </div>
            <br />
            <div v-show="selectedTab === 'Reviews'">
                <p v-if="!reviews.length">There are no reviews yet. Why not be the first?</p>
                <ul v-else class="list-group">
                    <li v-for="review in reviews" class="list-group-item">
                        <p><strong>{{ review.name }}</strong> gave this product <span class="badge bg-magenta rounded-pill">{{ review.rating }}/5</span></p>
                        <p>{{ review.review }}</p>
                    </li>
                </ul>
            </div>
            <div v-show="selectedTab === 'Leave a Review'">
                <product-review></product-review>
            </div>
        </div>
    `,

    data() {
        return {
            tabs: ['Reviews', 'Leave a Review'],
            selectedTab: 'Reviews'
        }
    },

    props: {
        reviews: {
            type: Array,
            required: false,
        }
    }
})

Vue.component('cart-content', {
    
    // Pass down cart contents from app
    props: {
        cart: {
            type: Array,
            required: true
        },

        premium: {
            type: Boolean,
            required: true
        }
    },

    template: `
        <div class="cart-content sticky-top text-end pt-3">
        <button @click="cartClick" class="btn btn-primary"><i class="fa-solid fa-cart-shopping fa-lg"></i></button>
            <div v-show="showCart" class="position-absolute end-0 text-start shopping-cart">
                <h3>Your Cart</h3>
                <table v-if="cart.length" class="table table-hover table-sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Item</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in cart">
                            <td>{{ index + 1 }}.</td>
                            <td>{{ item.product }} - {{ item.color }}</td>
                            <td>\${{ item.price }}</td>
                        </tr>
                    </tbody>
                    <tfoot class="table-group-divider">
                        <tr>
                            <td></td>
                            <td><strong>Subtotal:</strong></td>
                            <td>\${{ subTotal }}</td>
                        </tr>
                        </tr>
                            <tr>
                            <td></td>
                            <td><strong>Shipping:</strong> </td>
                            <td>\${{ shipping }}</td>
                        </tr>
                        <tr class="hr-top">
                            <td></td>
                            <td><strong>Total:</strong> </td>
                            <td>\${{ cartTotal }}</td>
                        </tr>
                    </tfoot>
                </table>
                <p v-else>Empty.</p>
            </div>
        </div>
    `,

    data() {
        return {
            showCart: false,
        }
    },

    computed: {


        // Sums the value of items in the cart
        subTotal(){
            return this.cart.reduce((acc, item) => acc + item.price, 0);
        },

        // Checks if user qualifies for free shipping
        shipping() {
            if (this.premium) {
                return " Free"            } else {
                return 8
            }
        },

        // Adds the cost of shipping to the subtotal to get the total cost
        cartTotal(){
            if (this.premium) {
                return this.subTotal
            } else {
                return this.subTotal + this.shipping
            }
        },
    },

    methods: {
        
        // Used to toggle cart visibility.
        cartClick(){
            this.showCart = !this.showCart
        }
    }
})

Vue.component('nav-bar', {
    template: `
        <nav class="navbar navbar-expand-lg bg-magenta-grad navbar-dark">
            <div class="container">
                <a class="navbar-brand" href="index.html">
                    <img src="./img/logos/Fox Pet Supplies.png" alt="FOX" height="80">
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarContent">
                    <ul class="navbar-nav">
                        <li class="nav-item" v-for="item in navItems"><a :class="{ active: item.navActive }" :href="item.navLink" class="nav-link">{{ item.navText }}</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    `,

    data() {
        return {
            // Array of navigation values for building navbar
            navItems: [
                {
                    navLink: "#",
                    navText: "Home",
                    navActive: false
                },

                {
                    navLink: "#",
                    navText: "Products",
                    navActive: true
                },

                {
                    navLink: "#",
                    navText: "FAQ",
                    navActive: false
                },
                {
                    navLink: "#",
                    navText: "About Us",
                    navActive: false
                }
            ]
        }
    }
})

var app = new Vue({

    el: '#app',

    data: {
        premium: false,
        cart: []
    },

    // Adds items to the global cart array
    methods: {
        updateCart(id) {
            this.cart.push(id)
        }
    }
});