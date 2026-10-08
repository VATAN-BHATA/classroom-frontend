import type { AuthProvider } from "@refinedev/core";
import { User, SignUpPayload } from "@/types";
import { authClient } from "@/lib/auth-client";

const getSessionUser = async (): Promise<User | null> => {
  try {
    const { data, error } = await authClient.getSession();

    if (error || !data?.user) {
      return null;
    }

    const sessionUser = data.user as unknown as Partial<User> & {
      role?: User["role"];
      imageCldPubId?: string | null;
      department?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
    };

    if (!sessionUser.id || !sessionUser.email || !sessionUser.name) {
      return null;
    }

    return {
      id: sessionUser.id,
      createdAt: sessionUser.createdAt
        ? new Date(sessionUser.createdAt).toISOString()
        : new Date().toISOString(),
      updatedAt: sessionUser.updatedAt
        ? new Date(sessionUser.updatedAt).toISOString()
        : new Date().toISOString(),
      email: sessionUser.email,
      name: sessionUser.name,
      role: (sessionUser.role as User["role"]) ?? "student",
      image: sessionUser.image ?? undefined,
      imageCldPubId: sessionUser.imageCldPubId ?? undefined,
      department: sessionUser.department ?? undefined,
    };
  } catch (error) {
    console.error("Session retrieval error:", error);
    return null;
  }
};

export const authProvider: AuthProvider = {
  register: async ({
    email,
    password,
    name,
    role,
    image,
    imageCldPubId,
  }: SignUpPayload) => {
    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image,
        role,
        imageCldPubId,
      } as SignUpPayload);

      if (error) {
        return {
          success: false,
          error: {
            name: "Registration failed",
            message:
              error?.message || "Unable to create account. Please try again.",
          },
        };
      }

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        error: {
          name: "Registration failed",
          message: "Unable to create account. Please try again.",
        },
      };
    }
  },
  login: async ({ email, password }) => {
    try {
      const { error } = await authClient.signIn.email({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Login error from auth client:", error);
        return {
          success: false,
          error: {
            name: "Login failed",
            message: error?.message || "Please try again later.",
          },
        };
      }

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      console.error("Login exception:", error);
      return {
        success: false,
        error: {
          name: "Login failed",
          message: "Please try again later.",
        },
      };
    }
  },
  logout: async () => {
    const { error } = await authClient.signOut();

    if (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        error: {
          name: "Logout failed",
          message: "Unable to log out. Please try again.",
        },
      };
    }

    localStorage.removeItem("user");

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
  check: async () => {
    const user = await getSessionUser();

    if (user) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
      error: {
        name: "Unauthorized",
        message: "Check failed",
      },
    };
  },
  getPermissions: async () => {
    const user = await getSessionUser();

    if (!user) return null;

    return {
      role: user.role,
    };
  },
  getIdentity: async () => {
    const user = await getSessionUser();

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      imageCldPubId: user.imageCldPubId,
    };
  },
};
