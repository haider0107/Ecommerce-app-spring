import { Product } from "@/types/product/productTypes";
import { Card, CardContent, Typography, Button } from "@mui/material";

export default function ProductCard({
  product,
  onAddToCart,
  addToCartLoading,
}: {
  product: Product;
  onAddToCart: (id: number) => void;
  addToCartLoading: boolean;
}) {
  return (
    <Card sx={{ width: 300 }}>
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
          {product.description}
        </Typography>

        <Typography variant="h6">${product.price}</Typography>

        <Typography variant="caption">
          Stock: {product.stockQuantity}
        </Typography>

        <Button
          disabled={addToCartLoading || product.stockQuantity === 0}
          loading={addToCartLoading}
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => onAddToCart(product.id)}
        >
          Add To Cart
        </Button>
      </CardContent>
    </Card>
  );
}
