interface Window {
    arweaveWallet: {
      connect: (permissions: string[], appInfo?: any, gateway?: any) => Promise<void>;
      getActiveAddress: () => Promise<string>;
      sign: (transaction: any) => Promise<any>;
      dispatch: (transaction: any) => Promise<any>;
      // Add other methods as needed
    };
  }