
const foods = [
  {
    id: 1,
    name: "Margherita Pizza",
    category: "Pizza",
    price: 199,
    description: "Classic cheese pizza with fresh tomato.",
    image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Veg Burger",
    category: "Burger",
    price: 129,
    description: "Crispy patty with fresh vegetables.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Chicken Biryani",
    category: "Biryani",
    price: 249,
    description: "Aromatic rice with delicious spices.",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d51a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Cheese Pizza",
    category: "Pizza",
    price: 229,
    description: "Loaded with cheese and tasty toppings.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Chicken Burger",
    category: "Burger",
    price: 179,
    description: "Juicy chicken patty in a soft bun.",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Veg Biryani",
    category: "Biryani",
    price: 169,
    description: "Flavourful rice cooked with vegetables.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Chocolate Cake",
    category: "Dessert",
    price: 99,
    description: "Rich and soft chocolate cake.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Ice Cream",
    category: "Dessert",
    price: 79,
    description: "A sweet and creamy dessert.",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 9,
    name: "Farmhouse Pizza",
    category: "Pizza",
    price: 279,
    description: "Pizza topped with fresh vegetables.",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80"
  }
];

let cart = [];
let selectedCategory = "All";

const money = amount =>
  "₹" + amount.toLocaleString("en-IN");

function renderFoods() {
  const search = document.getElementById("search")
    .value.trim().toLowerCase();

  const filtered = foods.filter(food =>
    (selectedCategory === "All" ||
      food.category === selectedCategory) &&
    food.name.toLowerCase().includes(search)
  );

  const grid = document.getElementById("food-grid");

  if (filtered.length === 0) {
    grid.innerHTML = "<p>No food items found.</p>";
    return;
  }

  grid.innerHTML = filtered.map(food => `
    <article class="food-card">
      <img src="${food.image}"
        alt="${food.name}" loading="lazy">
      <div class="food-info">
        <h3>${food.name}</h3>
        <p>${food.description}</p>
        <div class="food-bottom">
          <span class="price">${money(food.price)}</span>
          <button class="add-btn"
            onclick="addToCart(${food.id})">
            + Add to Cart
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

document.querySelectorAll(".category").forEach(button => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;

    document.querySelectorAll(".category")
      .forEach(item => item.classList.remove("active"));

    button.classList.add("active");
    renderFoods();
  });
});

document.getElementById("search")
  .addEventListener("input", renderFoods);

function addToCart(id) {
  const food = foods.find(item => item.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...food, quantity: 1 });
  }

  renderCart();
}

function changeQuantity(id, change) {
  const item = cart.find(food => food.id === id);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(food => food.id !== id);
  }

  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(food => food.id !== id);
  renderCart();
}

function getSubtotal() {
  return cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );
}

function renderCart() {
  const count = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const subtotal = getSubtotal();
  const delivery = subtotal === 0 ? 0 : 40;

  document.getElementById("cart-count").textContent = count;
  document.getElementById("subtotal").textContent =
    money(subtotal);
  document.getElementById("delivery").textContent =
    money(delivery);
  document.getElementById("total").textContent =
    money(subtotal + delivery);

  const container = document.getElementById("cart-items");

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong>
          <p>${money(item.price * item.quantity)}</p>
          <div class="quantity-controls">
            <button onclick="changeQuantity(${item.id}, -1)"
              aria-label="Decrease quantity">−</button>
            <span>${item.quantity}</span>
            <button onclick="changeQuantity(${item.id}, 1)"
              aria-label="Increase quantity">+</button>
          </div>
          <button class="remove-btn"
            onclick="removeFromCart(${item.id})">
            Remove
          </button>
        </div>
      </div>
    `).join("");
  }
}

function toggleCart() {
  const panel = document.getElementById("cart-panel");
  panel.hidden = !panel.hidden;
}

function checkout() {
  if (cart.length === 0) {
    alert("Please add food items to your cart first.");
    return;
  }

  document.getElementById("checkout-total").textContent =
    "Total amount: " +
    money(getSubtotal() + 40);

  document.getElementById("checkout-modal").hidden = false;
}

function closeCheckout() {
  document.getElementById("checkout-modal").hidden = true;
}

document.getElementById("checkout-form")
  .addEventListener("submit", function(event) {
    event.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty.");
      closeCheckout();
      return;
    }

    const form = new FormData(this);
    const customer = form.get("customerName");
    const total = getSubtotal() + 40;
    const orderNumber = "FD" + Date.now().toString().slice(-8);

    alert(
      "Demo order placed successfully!\n" +
      "Order ID: " + orderNumber + "\n" +
      "Customer: " + customer + "\n" +
      "Total: " + money(total) + "\n\n" +
      "This is a frontend demo. No real order was sent."
    );

    cart = [];
    renderCart();
    this.reset();
    closeCheckout();
    document.getElementById("cart-panel").hidden = true;
  });

renderFoods();
renderCart();