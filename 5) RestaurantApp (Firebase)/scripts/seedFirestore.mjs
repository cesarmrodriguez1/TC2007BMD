import {
  cert,
  getApps,
  initializeApp
} from "firebase-admin/app";

import {
  getAuth
} from "firebase-admin/auth";

import {
  getFirestore,
  FieldValue
} from "firebase-admin/firestore";

import fs from "fs";
import path from "path";
import {
  fileURLToPath
} from "url";


// ======================================================
// CONFIGURACIÓN DE RUTAS
// ======================================================

const __filename =
  fileURLToPath(
    import.meta.url
  );

const __dirname =
  path.dirname(
    __filename
  );

const databasePath =
  path.join(
    __dirname,
    "../database/restaurant.json"
  );

const serviceAccountPath =
  path.join(
    __dirname,
    "serviceAccountKey.json"
  );


// ======================================================
// LEER SERVICE ACCOUNT
// ======================================================

const serviceAccount =
  JSON.parse(
    fs.readFileSync(
      serviceAccountPath,
      "utf8"
    )
  );


// ======================================================
// INICIALIZAR FIREBASE ADMIN
// ======================================================

const firebaseApp =
  getApps().length === 0
    ? initializeApp({
        credential:
          cert(
            serviceAccount
          )
      })
    : getApps()[0];


// ======================================================
// OBTENER SERVICIOS FIREBASE
// ======================================================

const auth =
  getAuth(
    firebaseApp
  );

const db =
  getFirestore(
    firebaseApp
  );


// ======================================================
// LEER restaurant.json
// ======================================================

if (
  !fs.existsSync(
    databasePath
  )
) {
  throw new Error(
    `No se encontró el archivo:\n${databasePath}`
  );
}

const restaurantData =
  JSON.parse(
    fs.readFileSync(
      databasePath,
      "utf8"
    )
  );


// ======================================================
// FUNCIÓN AUXILIAR
// ======================================================

const getValue =
  (
    value,
    defaultValue = ""
  ) => {
    return (
      value ??
      defaultValue
    );
  };


// ======================================================
// MAPA EMAIL -> UID
// ======================================================

const userUidByEmail =
  new Map();


// ======================================================
// CREAR / OBTENER USUARIOS DE AUTHENTICATION
// ======================================================

const seedAuthenticationUsers =
  async () => {

    if (
      !Array.isArray(
        restaurantData.authUsers
      )
    ) {
      console.log(
        "No existen usuarios en authUsers."
      );

      return;
    }

    console.log(
      "\n=== FIREBASE AUTHENTICATION ==="
    );

    for (
      const userData
      of restaurantData.authUsers
    ) {

      const email =
        getValue(
          userData.email
        )
          .trim()
          .toLowerCase();

      const password =
        getValue(
          userData.password
        );

      const displayName =
        getValue(
          userData.displayName
        );

      if (
        !email ||
        !password
      ) {
        console.warn(
          "Usuario ignorado: faltan email o password."
        );

        continue;
      }

      let firebaseUser;

      try {

        firebaseUser =
          await auth.createUser({
            email,
            password,
            displayName
          });

        console.log(
          `Usuario creado: ${email}`
        );

      } catch (error) {

        if (
          error.code ===
          "auth/email-already-exists"
        ) {

          firebaseUser =
            await auth.getUserByEmail(
              email
            );

          console.log(
            `Usuario existente: ${email}`
          );

        } else {

          console.error(
            `Error creando ${email}:`,
            error.message
          );

          continue;
        }
      }

      userUidByEmail.set(
        email,
        firebaseUser.uid
      );

      console.log(
        `UID: ${firebaseUser.uid}`
      );
    }
  };


// ======================================================
// RESOLVER UID
// ======================================================

const resolveUserUid =
  async (
    userData
  ) => {

    if (
      userData?.uid
    ) {
      return userData.uid;
    }

    const email =
      getValue(
        userData?.email
      )
        .trim()
        .toLowerCase();

    if (!email) {
      return null;
    }

    const mappedUid =
      userUidByEmail.get(
        email
      );

    if (mappedUid) {
      return mappedUid;
    }

    try {

      const firebaseUser =
        await auth.getUserByEmail(
          email
        );

      userUidByEmail.set(
        email,
        firebaseUser.uid
      );

      return firebaseUser.uid;

    } catch {
      return null;
    }
  };


// ======================================================
// SEED DE CATEGORÍAS
// ======================================================

const seedCategories =
  async () => {

    if (
      !Array.isArray(
        restaurantData.categories
      )
    ) {
      return;
    }

    console.log(
      "\n=== CATEGORÍAS ==="
    );

    for (
      const category
      of restaurantData.categories
    ) {

      if (!category.id) {
        continue;
      }

      await db
        .collection(
          "categories"
        )
        .doc(
          category.id
        )
        .set(
          {
            id: category.id,
            name:
              getValue(
                category.name
              )
          },
          {
            merge: true
          }
        );

      console.log(
        `Categoría: ${category.id}`
      );
    }
  };


// ======================================================
// SEED DE PLATILLOS
// ======================================================

const seedDishes =
  async () => {

    if (
      !Array.isArray(
        restaurantData.dishes
      )
    ) {
      return;
    }

    console.log(
      "\n=== PLATILLOS ==="
    );

    for (
      const dish
      of restaurantData.dishes
    ) {

      if (!dish.id) {
        continue;
      }

      await db
        .collection(
          "dishes"
        )
        .doc(
          dish.id
        )
        .set(
          {
            id: dish.id,
            name:
              getValue(
                dish.name
              ),
            description:
              getValue(
                dish.description
              ),
            price:
              Number(
                getValue(
                  dish.price,
                  0
                )
              ),
            image:
              getValue(
                dish.image
              ),
            category:
              getValue(
                dish.category
              ),
            available:
              Boolean(
                getValue(
                  dish.available,
                  true
                )
              )
          },
          {
            merge: true
          }
        );

      console.log(
        `Platillo: ${dish.id}`
      );
    }
  };


// ======================================================
// SEED DE PERFILES DE USUARIOS
// ======================================================

const seedUserProfiles =
  async () => {

    if (
      !Array.isArray(
        restaurantData.users
      )
    ) {
      return;
    }

    console.log(
      "\n=== PERFILES DE USUARIOS ==="
    );

    for (
      const profile
      of restaurantData.users
    ) {

      const uid =
        await resolveUserUid(
          profile
        );

      if (!uid) {

        console.warn(
          `No se pudo resolver UID para: ${profile.email}`
        );

        continue;
      }

      await db
        .collection(
          "users"
        )
        .doc(
          uid
        )
        .set(
          {
            name:
              getValue(
                profile.name
              ),
            lastName:
              getValue(
                profile.lastName
              ),
            email:
              getValue(
                profile.email
              ),
            phone:
              getValue(
                profile.phone
              ),
            address:
              getValue(
                profile.address
              )
          },
          {
            merge: true
          }
        );

      console.log(
        `Perfil creado: users/${uid}`
      );
    }
  };


// ======================================================
// SEED DE CARRITOS
// ======================================================

const seedCarts =
  async () => {

    if (
      !Array.isArray(
        restaurantData.carts
      )
    ) {
      return;
    }

    console.log(
      "\n=== CARRITOS ==="
    );

    for (
      const cart
      of restaurantData.carts
    ) {

      const uid =
        await resolveUserUid(
          cart
        );

      if (!uid) {

        console.warn(
          `No se pudo resolver UID del carrito. Email: ${cart.email ?? "sin email"}`
        );

        continue;
      }

      const items =
        Array.isArray(
          cart.items
        )
          ? cart.items
          : [];

      const total =
        items.reduce(
          (
            sum,
            item
          ) => {

            const price =
              Number(
                getValue(
                  item.price,
                  0
                )
              );

            const quantity =
              Number(
                getValue(
                  item.quantity,
                  0
                )
              );

            return (
              sum +
              price *
              quantity
            );
          },
          0
        );

      await db
        .collection(
          "users"
        )
        .doc(
          uid
        )
        .collection(
          "cart"
        )
        .doc(
          "current"
        )
        .set(
          {
            items,
            total
          },
          {
            merge: true
          }
        );

      console.log(
        `Carrito creado: users/${uid}/cart/current`
      );
    }
  };


// ======================================================
// SEED DE ÓRDENES
// ======================================================

const seedOrders =
  async () => {

    if (
      !Array.isArray(
        restaurantData.orders
      )
    ) {
      return;
    }

    console.log(
      "\n=== ÓRDENES ==="
    );

    for (
      const order
      of restaurantData.orders
    ) {

      const uid =
        await resolveUserUid(
          order
        );

      if (!uid) {

        console.warn(
          `No se pudo resolver UID de la orden. Email: ${order.email ?? "sin email"}`
        );

        continue;
      }

      const items =
        Array.isArray(
          order.items
        )
          ? order.items.map(
              item => ({
                dishId:
                  getValue(
                    item.dishId
                  ),
                name:
                  getValue(
                    item.name
                  ),
                price:
                  Number(
                    getValue(
                      item.price,
                      0
                    )
                  ),
                quantity:
                  Number(
                    getValue(
                      item.quantity,
                      0
                    )
                  ),
                subtotal:
                  Number(
                    getValue(
                      item.subtotal,
                      0
                    )
                  ),
                image:
                  getValue(
                    item.image
                  )
              })
            )
          : [];

      const total =
        Number(
          order.total ??
          items.reduce(
            (
              sum,
              item
            ) =>
              sum +
              item.subtotal,
            0
          )
        );

      const orderData = {
        userId: uid,

        status:
          getValue(
            order.status,
            "pending"
          ),

        total,

        createdAt:
          getValue(
            order.createdAt,
            new Date().toISOString()
          ),

        items
      };

      if (
        order.id
      ) {

        await db
          .collection(
            "orders"
          )
          .doc(
            order.id
          )
          .set(
            orderData,
            {
              merge: true
            }
          );

        console.log(
          `Orden creada: orders/${order.id}`
        );

      } else {

        const reference =
          await db
            .collection(
              "orders"
            )
            .add(
              orderData
            );

        console.log(
          `Orden creada: orders/${reference.id}`
        );
      }
    }
  };


// ======================================================
// EJECUTAR SEED
// ======================================================

const seedFirebase =
  async () => {

    console.log(
      "========================================"
    );

    console.log(
      "   SEED FIREBASE - RESTAURANT APP"
    );

    console.log(
      "========================================"
    );

    await seedAuthenticationUsers();

    await seedCategories();

    await seedDishes();

    await seedUserProfiles();

    await seedCarts();

    await seedOrders();

    console.log(
      "\n========================================"
    );

    console.log(
      "Seed completado correctamente."
    );

    console.log(
      "========================================"
    );
  };


// ======================================================
// INICIAR
// ======================================================

seedFirebase()
  .catch(
    error => {

      console.error(
        "\nError durante el seed:"
      );

      console.error(
        error
      );

      process.exit(
        1
      );
    }
  );