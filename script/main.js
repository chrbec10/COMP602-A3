var eventBus = new Vue()

Vue.component('product', {

    template: `
        <div id="product">

            <div class="product-image">
                <img :src="image" :alt="alt" />
            </div>

            <div class="product-info">

                <h1>{{ title }}</h1>

                <p v-if="inStock">In Stock</p>
                <p v-else :class="{ noStock: !inStock }">Out of Stock</p>

                <h2>Details</h2>
                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>

                <h3>Colours</h3>
                <div style="display:block">
                <div v-for="(variant, index) in variants" :key="variant.variantId" style="display:inline-block">
                    <div class="color-box" 
                        :style="{ backgroundColor: variant.variantColor }"
                        @click="updateProduct(index)">
                    </div>
                </div>
                </div>
                <button @click="addToCart"
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }">
                Add to cart</button>
            </div>
            <product-tabs :reviews="reviews"></product-tabs>
        </div>
    `,
    data() {
        return {
            product: "Kittens",
            brand: "Tiny",
            selectedVariant: 0,
            alt: "Some kittens",
            details: ["Gender-neutral", "Vegan", "Do not feed after midnight"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "brown",
                    variantImage: "https://placekitten.com/200/200",
                    variantQuantity: 10,
                    variantPrice: 499.99
                },
                {
                    variantId: 2235,
                    variantColor: "black",
                    variantImage: "https://placekitten.com/201/201",
                    variantQuantity: 5,
                    variantPrice: 699.99
                },
                {
                    variantId: 2236,
                    variantColor: "orange",
                    variantImage: "https://placekitten.com/199/199",
                    variantQuantity: 0,
                    variantPrice: 299.99
                }
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

        // Changes image to selected product
        updateProduct(index) {
            this.selectedVariant = index
        },
        
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },

        image() {
            return this.variants[this.selectedVariant].variantImage
        },

        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
    },

    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})

Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">

            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" placeholder="name">
            </p>

            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review"></textarea>
            </p>

            <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors">{{ error }}</li>
                </ul>
            </p>

            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>

            
            <p>
                <input type="submit" value="Submit">
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
        onSubmit() {
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
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul v-else>
                    <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                    </li>
                </ul>
            </div>

            <div v-show="selectedTab === 'Make a Review'">
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
        <div clas="cart-content">
            <h2>Your Cart</h2>

            <table v-if="cart.length">
                <thead>
                    <tr>
                        <th>Num.</th>
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
                    <tr>
                        <td></td>
                        <td></td>
                        <td>Shipping: {{ shipping }}</td>
                </tbody>
            </table>
        </div>
    `,

    computed: {
        cartTotal() {
            return 0
        },

        shipping() {
            if (this.premium) {
                return "Free"
            } else {
                return 2.99
            }
        }
    }
})

Vue.component('nav-bar', {
    template: `
        <nav class="navbar navbar-expand-lg bg-success navbar-dark">
            <div class="container">
                <a class="navbar-brand" href="index.html">
                    <img src="./img/header-logo.png" alt="Paradise Zoo" height="40">
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
                }
            ]
        }
    }
})

var app = new Vue({

    el: '#app',

    data: {
        premium: true,
        cart: []
    },

    methods: {
        updateCart(id) {
            this.cart.push(id)
        }
    }
})



