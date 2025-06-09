import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [
        {
          book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
          },
          quantity: {
            type: Number,
            min: 1,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
