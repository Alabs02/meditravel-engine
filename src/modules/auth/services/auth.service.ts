import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import { ENV } from "@/config";
import { auth } from "firebase-admin";

@Injectable()
export class AuthService {
  private readonly firebaseApp: admin.app.App;

  constructor() {
    if (!admin.apps.length) {
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: ENV.FIREBASE_PROJECT_ID,
          clientEmail: ENV.FIREBASE_CLIENT_EMAIL,
          privateKey: ENV.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
        })
      });
    }
  }

  async createUser(data: {
    email: string;
    password: string;
    displayName: string;
  }): Promise<auth.UserRecord> {
    return auth().createUser({
      email: data.email,
      password: data.password,
      displayName: data.displayName
    });
  }

  async verifyToken(idToken: string) {
    return admin.auth().verifyIdToken(idToken);
  }
}
