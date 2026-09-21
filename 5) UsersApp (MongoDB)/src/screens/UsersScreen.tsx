import React, {
  useCallback,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useFocusEffect,
} from "@react-navigation/native";

import type {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import {
  deleteUser,
  getUsers,
} from "../services/userService";

import type {
  User,
} from "../types/User";

import type {
  RootStackParamList,
} from "../navigation/AppNavigator";


type Props =
  NativeStackScreenProps<
    RootStackParamList,
    "Users"
  >;


export default function UsersScreen({
  navigation,
}: Props) {
  const [
    users,
    setUsers,
  ] = useState<User[]>([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    refreshing,
    setRefreshing,
  ] = useState(false);


  const loadUsers =
    useCallback(
      async (): Promise<void> => {
        try {
          setLoading(true);

          const data =
            await getUsers();

          setUsers(data);
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "No fue posible obtener los usuarios";

          Alert.alert(
            "Error",
            message
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );


  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [loadUsers])
  );


  async function handleRefresh(): Promise<void> {
    try {
      setRefreshing(true);

      const data =
        await getUsers();

      setUsers(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No fue posible actualizar la lista";

      Alert.alert(
        "Error",
        message
      );
    } finally {
      setRefreshing(false);
    }
  }


  function handleDelete(
    user: User
  ): void {
    Alert.alert(
      "Eliminar usuario",
      `¿Deseas eliminar a ${user.name}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },

        {
          text: "Eliminar",
          style: "destructive",

          onPress: async () => {
            try {
              await deleteUser(
                user._id
              );

              setUsers(
                currentUsers =>
                  currentUsers.filter(
                    currentUser =>
                      currentUser._id !==
                      user._id
                  )
              );

              Alert.alert(
                "Usuario eliminado",
                "El usuario fue eliminado correctamente."
              );
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : "No fue posible eliminar el usuario";

              Alert.alert(
                "Error",
                message
              );
            }
          },
        },
      ]
    );
  }


  function renderRightActions(
    user: User
  ) {
    return (
      <View style={styles.deleteAction}>
        <Pressable
          style={styles.deleteButton}
          onPress={() =>
            handleDelete(user)
          }
        >
          <Text style={styles.deleteText}>
            Eliminar
          </Text>
        </Pressable>
      </View>
    );
  }


  function renderUser({
    item,
  }: {
    item: User;
  }) {
    return (
      <View style={styles.swipeContainer}>
        <Swipeable
          friction={2}
          rightThreshold={40}
          overshootRight={false}
          renderRightActions={() =>
            renderRightActions(item)
          }
        >
          <Pressable
            style={styles.userCard}
            onPress={() =>
              navigation.navigate(
                "UserDetail",
                {
                  userId: item._id,
                }
              )
            }
          >
            <View style={styles.userInfo}>
              <Text
                style={styles.userName}
                numberOfLines={1}
              >
                {item.name}
              </Text>

              <Text
                style={styles.userEmail}
                numberOfLines={1}
              >
                {item.email}
              </Text>

              <Text style={styles.userPhone}>
                {item.phone}
              </Text>
            </View>

            <Text style={styles.arrow}>
              ›
            </Text>
          </Pressable>
        </Swipeable>
      </View>
    );
  }


  if (
    loading &&
    users.length === 0
  ) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
        />

        <Text style={styles.loadingText}>
          Cargando usuarios...
        </Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Usuarios
          </Text>

          <Text style={styles.subtitle}>
            {users.length} usuario
            {users.length !== 1
              ? "s"
              : ""}
          </Text>
        </View>
      </View>


      <FlatList
        data={users}
        keyExtractor={(item) =>
          item._id
        }
        renderItem={renderUser}
        contentContainerStyle={
          users.length === 0
            ? styles.emptyContent
            : styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              No hay usuarios
            </Text>

            <Text style={styles.emptyText}>
              Todavía no existen usuarios registrados.
            </Text>
          </View>
        }
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 4,
    color: "#64748B",
    fontSize: 14,
  },

  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },

  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },

  swipeContainer: {
    marginVertical: 6,
    borderRadius: 14,
    overflow: "hidden",
  },

  userCard: {
    minHeight: 100,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  userInfo: {
    flex: 1,
    paddingRight: 15,
  },

  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#172033",
  },

  userEmail: {
    marginTop: 5,
    fontSize: 14,
    color: "#475569",
  },

  userPhone: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748B",
  },

  arrow: {
    fontSize: 30,
    color: "#94A3B8",
  },

  deleteAction: {
    width: 110,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
  },

  deleteButton: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  deleteText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#475569",
  },

  emptyContainer: {
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  emptyText: {
    marginTop: 8,
    color: "#64748B",
    textAlign: "center",
  },
});