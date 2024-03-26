type LogoutFunction = () => Promise<void>;

let globalLogout: LogoutFunction = async () => {};

export const registerGlobalLogout = (logoutFunc: LogoutFunction): void => {
  globalLogout = logoutFunc;
};

export const handleGlobalLogout = (): Promise<void> => {
  return globalLogout();
};
