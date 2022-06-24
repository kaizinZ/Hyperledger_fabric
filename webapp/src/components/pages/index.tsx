import React, { useEffect } from "react";

import { createApiClient } from "../../utils/ApiClientFactory";

export const Top: React.VFC = () => {
  useEffect(() => {
    (async () => {
      const res = await (
        await createApiClient()
      ).test({
        text: "hogehoge",
      });
      // eslint-disable-next-line no-console
      console.log(res);
    })();
  }, []);

  return <div>Hello World!</div>;
};
