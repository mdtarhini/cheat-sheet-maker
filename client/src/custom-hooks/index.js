import { useState, useEffect, useRef } from "react";
import axios from "axios";
export const useGetUserInfo = (userId) => {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    let isMounted = true;
    const fetchUser = () => {
      axios.get(`/api/users/user-info/${userId}`).then((userRes) => {
        if (isMounted) {
          setUserInfo(userRes.data);
        }
      });
    };

    if (userId) {
      fetchUser();
    }

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return userInfo;
};

export const useIsMounted = () => {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted.current;
};

export const useMenuToggler = () => {
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const bodyClickEvent = (e) => {
      if (menuRef.current !== null && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open) {
      window.addEventListener("click", bodyClickEvent);
    }

    return () => {
      window.removeEventListener("click", bodyClickEvent);
    };
  }, [open, menuRef]);

  return [open, toggle, menuRef];
};

export const useKeyPress = (targetKey) => {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler(e) {
    if (e.key === targetKey) {
      setKeyPressed(true);
    }
  }

  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  });

  return keyPressed;
};

export const useWindowsSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Set window width/height to state
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
};
