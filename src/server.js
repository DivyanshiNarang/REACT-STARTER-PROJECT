import { Response } from "miragejs";
import { Server, Model, RestSerializer } from "miragejs";
import { users } from "./backend/db/users";
import { products} from "./backend/db/products";
import { v4 as uuid } from "uuid";
import { formatDate, secretcode , requiresAuth } from "./backend/utils/constant";
import sign from "jwt-encode";
import jwtDecode from "jwt-decode";


export  default function makeServer({ environment = "development" } = { }) {
  return new Server({
    serializers: {
      application: RestSerializer,
    },
    environment,
    models: {
     user: Model,
     product:Model
   },
    seeds(server) {

users.forEach((element) => {
 
        server.create("user", { ...element ,cart:[],wishlist:[]});

});

 products.forEach((element)=>{

   server.create("product",{...element})
 })

},

    routes() {


      this.namespace = "api";

      this.post("/auth/signup", (schema,request ) => {
        const { email, password, ...rest } = JSON.parse(request.requestBody);
        try {
          const foundUser = schema.users.findBy({ email });
          if (foundUser) {

            alert("User Already exist!")
            return new Response(
              422,
              { },
              {
                errors: ["Unprocessable Entity. Email Already Exists."],
              }
            );
          }
          else
          {

            const _id = uuid();
            const newUser = {

              _id,
              email,
              password,
              createdAt: formatDate(),
              updatedAt: formatDate(),
              ...rest

            };

            const createdUser =schema.users.create(newUser)
            
          const encodedToken = sign({ _id, email }, secretcode);
          return new Response(201, {}, { createdUser, encodedToken });

          }
       

        } catch (error) {
          return new Response(
            500,
            {},
            {
              error,
            }
          );
        }
      });


      this.post("/auth/login",(schema,request)=>{


        const { email, password } = JSON.parse(request.requestBody);
        try {
          const foundUser = schema.users.findBy({ email:email });
          if (!foundUser) {
            return new Response(
              404,
              {},
              { errors: ["The email you entered is not Registered. Not Found error"] }
            );
          }
          if (password === foundUser.password) {
            const encodedToken = sign(
              { _id: foundUser._id, email },
              secretcode
            );
            foundUser.password = undefined;
            return new Response(200, {}, { foundUser, encodedToken });
          }
          return new Response(
            401,
            {},
            {
              errors: [
                "The credentials you entered are invalid. Unauthorized access error.",
              ],
            }
          );
        } catch (error) {
          return new Response(
            500,
            {},
            {
              error,
            }
          );
        }

      })

      this.get("/auth/getproducts",(schema,request)=>{

        const encodedToken = request.requestHeaders.Authorization;

        const decodeToken = jwtDecode(encodedToken);

        if(decodeToken)
        {

          const user = schema.users.findBy({ email: decodeToken.email });

          if(user)
          {


            return new Response(201,{},{products:this.db.products});
          }

        }
        return new Response(
          401,
          {},
          { errors: ["The token is invalid. Unauthorized access error."] }
        );



      


      })


      // cart routes (private)
      this.get("/user/cart", (schema,request)=>{

        const userId = requiresAuth.call(this,request);

        if(!userId)
        {
          return new Response(404 ,{},{ error :"The email you entered is not Registered. Not Found error"})
        }

        const cart = schema.users.findBy({_id:userId}).cart;

        return new Response(200,{},{cart:cart});

      });


      this.post("/user/cart", (schema,request)=>{


        const userId = requiresAuth.call(this, request);

        try {
          if (!userId) {
            return new Response(
              404,
              {},
              {
                errors: ["The email you entered is not Registered. Not Found error"],
              }
            );
          }
          const userCart = schema.users.findBy({ _id: userId }).cart;
          const { product } = JSON.parse(request.requestBody);
          userCart.push({
            ...product,
            createdAt: formatDate(),
            updatedAt: formatDate(),
            qty: 1,
          });
          this.db.users.update({ _id: userId }, { cart: userCart });
          return new Response(201, {}, { cart: userCart });
        } catch (error) {
          return new Response(
            500,
            {},
            {
              error,
            }
          );
        }


      });



      this.delete("/user/cart/:productId", (schema,request)=>{


        const userId = requiresAuth.call(this, request);

        try {
          if (!userId) {
            return new Response(
              404,
              {},
              {
                errors: ["The email you entered is not Registered. Not Found error"],
              }
            );
          }
          let userCart = schema.users.findBy({ _id: userId }).cart;
          const productId = request.params.productId;
          userCart = userCart.filter((item) => item._id !== productId);
          this.db.users.update({ _id: userId }, { cart: userCart });
          return new Response(200, {}, { cart: userCart });
        } catch (error) {
          return new Response(
            500,
            {},
            {
              error,
            }
          );
        }



        });

    
    },

  });
}
