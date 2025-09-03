// POST Method
function handleAddPhoto(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value;
  const photo = form.photo.files[0];

  const data = new FormData();
  data.append("image", photo);

  fetch(img_api_key, {
    method: "POST",
    body: data,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Upload success:", data);
      const photoObj = {
        name,
        image: data.data.url,
      };

      axiosSecure
        .post("/photo", photoObj)
        .then(() => {
          Swal.fire({
            title: "Photo Added!",
            text: "Your photo was successfully added.",
            icon: "success",
          });
        })
        .catch((err) => {
          console.error(err);
          Swal.fire({
            title: "Something Went Wrong",
            icon: "error",
            draggable: true,
          });
        });

      form.reset();
    });
}

//   UPDATE Data

const handleUpdate = (e) => {
  e.preventDefault();
  const name = e.target.name.value;
  const description = e.target.description.value;
  const sortdes = e.target.sortdes.value;

  const imageUploadPromises = [];

  images.forEach(({ file, price, color, prePrice, itemStock, quantity }, i) => {
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      const uploadPromise = fetch(img_api_key, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((imgData) => ({
          img: imgData.data.url,
          price: parseFloat(price) || 0,
          color: color || "",
          prePrice: parseFloat(prePrice) || 0,
          itemStock: itemStock || "",
          quantity: parseInt(quantity) || 0, // ✅ from state, not e.target
        }));

      imageUploadPromises.push(uploadPromise);
    } else if (product.images[i]) {
      // Keep old image but use updated values
      imageUploadPromises.push(
        Promise.resolve({
          img: product.images[i].img,
          price: parseFloat(price) || 0,
          color: color || "",
          prePrice: parseFloat(prePrice) || 0,
          itemStock: itemStock || "",
          quantity: parseInt(quantity) || 0, // ✅ from state
        })
      );
    }
  });

  Promise.all(imageUploadPromises).then((newImages) => {
    const updatedData = {
      name,
      description,
      category,
      sub,
      features,
      images: newImages.length > 0 ? newImages : product.images,
      sortdes,
    };

    axiosSecure.patch(`/products/${id}`, updatedData).then(() => {
      Swal.fire({
        title: "Product Updated",
        icon: "success",
      });
      refetch();
    });
  });
};

//   DELETE API

const handleDelete = (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to Deelte this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      axiosSecure
        .delete(`/products/${id}`)
        .then((res) => {
          Swal.fire({
            title: "Deleted!",
            text: `This Item Has been deleted`,
            icon: "success",
          });

          refetch();
        })
        .catch((err) => {
          Swal.fire({
            title: "Error!",
            text: "Something went wrong.",
            icon: "error",
          });
          // console.error(err);
        });
    }
  });
};

//   GET Apis

const [products, setProducts] = useState([]);
const [mouse, setMouse] = useState("");
const [search, setSearch] = useState("");
const [dbSearch, setDbSearch] = useState("");

useEffect(() => {
  fetch(`https://potato-tech-server.vercel.app/products?category=${mouse}`)
    .then((res) => res.json())
    .then((data) => setProducts(data))
    .catch((err) => console.error("Error fetching products:", err));
}, [mouse]);
console.log(mouse);
useEffect(() => {
  const timer = setTimeout(() => {
    setDbSearch(search.trim().toLowerCase());
  }, 500);
  return () => clearTimeout(timer);
}, [search]);

const filterItem = products.filter(
  (item) =>
    dbSearch === "" ||
    item.name?.toLowerCase().includes(dbSearch) ||
    item.category?.toLowerCase().includes(dbSearch)
);

//   Sorting Data

function handleSort(e) {
  const value = e.target.value;
  let sortedProducts = [...products];

  if (value === "lowToHigh") {
    sortedProducts.sort(
      (a, b) => (a.images?.[0]?.price || 0) - (b.images?.[0]?.price || 0)
    );
  } else if (value === "highToLow") {
    sortedProducts.sort(
      (a, b) => (b.images?.[0]?.price || 0) - (a.images?.[0]?.price || 0)
    );
  }

  setProducts(sortedProducts);
}

function reset() {
  setSearch("");
  setMouse("");
}
