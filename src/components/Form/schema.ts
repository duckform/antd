import type { ISchema } from "@formily/react";
import { FormLayout } from "../FormLayout/schema";
import { CSSStyle } from "../../common/schemas";

export const Form: ISchema = {
  type: "object",
  properties: {
    ...(FormLayout.properties as any),
    style: CSSStyle,
  },
};
