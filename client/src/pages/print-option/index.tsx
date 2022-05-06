import React, { useEffect, useState } from "react";
import { queryStore } from "@/services";
import StoreCard from "@/components/store-card";
import Container from "@/components/container/index";

import styles from "./index.module.less";

interface Props {}

const PrintOption: React.FC<Props> = () => {
  const [storeData, setStoreData] = useState<StoreDb>({} as StoreDb);

  useEffect(() => {
    queryStore().then((res) => {
      setStoreData(res.data[0] as StoreDb);
    });
  }, []);

  return (
    <Container className={styles.wrapper}>
      <StoreCard value={storeData} />
    </Container>
  );
};

export default PrintOption;

definePageConfig({
  backgroundTextStyle: "light",
  navigationBarBackgroundColor: "#36b7ab",
  navigationBarTextStyle: "white",
  navigationBarTitleText: "打印选项",
  backgroundColor: "#f5f6f9",
});
