from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import auth
from .products import api as products
from .orders import api as orders
from .users import api as users
from .categories import api as categories
from .manufacturer import api as manufacturers
from .unit_of_measurement import api as unit_of_measurement


app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(categories.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(manufacturers.router)
app.include_router(unit_of_measurement.router)


@app.get("/")
def root():
    return {"message": "open /docs"}
