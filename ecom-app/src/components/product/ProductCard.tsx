import { ProductResponse } from "@/types/product/productTypes";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  Chip,
  Box,
} from "@mui/material";

const fallbackImage =
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600";

export default function ProductCard({
  product,
  onAddToCart,
  addToCartLoading,
}: {
  product: ProductResponse;
  onAddToCart: (id: number) => void;
  addToCartLoading: boolean;
}) {
  return (
    <Card
      sx={{
        width: 280,
        borderRadius: 3,
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={product.imageUrl || fallbackImage}
        alt={product.name}
        sx={{
          objectFit: "cover",
        }}
      />

      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1, minHeight: 40 }}
        >
          {product.description}
        </Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="h6" color="primary">
            ${product.price}
          </Typography>

          <Chip
            label={`Stock: ${product.stockQuantity}`}
            size="small"
            color={product.stockQuantity > 0 ? "success" : "error"}
          />
        </Box>

        <Button
          disabled={addToCartLoading || product.stockQuantity === 0}
          fullWidth
          variant="contained"
          sx={{ mt: 1 }}
          onClick={() => onAddToCart(product.id)}
        >
          {addToCartLoading ? "Adding..." : "Add To Cart"}
        </Button>
      </CardContent>
    </Card>
  );
}
