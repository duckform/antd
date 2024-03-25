import { createBehavior } from "@duckform/core";
import {
  createFieldSchema,
  createVoidFieldSchema,
} from "../../components/Field";
import * as ArrayBaseLocales from "./locale";
import { ISchema } from "@formily/json-schema";

type Name = "ArrayTable" | "ArrayCards" | (string & {});
export const createArrayBehavior = (
  name: Name,
  schemas: ISchema | Record<string, ISchema>,
  locales: Record<string, object>,
) => {
  return createBehavior(
    {
      name,
      extends: ["Field"],
      selector: (node) => node.props?.["x-component"] === name,
      designerProps: {
        droppable: true,
        propsSchema: createFieldSchema(schemas),
      },
      designerLocales: locales,
    },
    {
      name: `${name}.Addition`,
      extends: ["Field"],
      selector: (node) => node.props?.["x-component"] === `${name}.Addition`,
      designerProps: {
        allowDrop(parent) {
          return parent.props?.["x-component"] === name;
        },
        propsSchema: createVoidFieldSchema((schemas as any).Addition),
      },
      designerLocales:
        (locales as any).ArrayAddition ?? ArrayBaseLocales.ArrayAddition,
    },
    {
      name: `${name}.Remove`,
      extends: ["Field"],
      selector: (node) => node.props?.["x-component"] === `${name}.Remove`,
      designerProps: {
        allowDrop(parent) {
          return parent.props?.["x-component"] === name;
        },
        propsSchema: createVoidFieldSchema(),
      },
      designerLocales:
        (locales as any).ArrayRemove ?? ArrayBaseLocales.ArrayRemove,
    },
    {
      name: `${name}.Index`,
      extends: ["Field"],
      selector: (node) => node.props?.["x-component"] === `${name}.Index`,
      designerProps: {
        allowDrop(parent) {
          return parent.props?.["x-component"] === name;
        },
        propsSchema: createVoidFieldSchema(),
      },
      designerLocales:
        (locales as any).ArrayIndex ?? ArrayBaseLocales.ArrayIndex,
    },
    {
      name: `${name}.MoveUp`,
      extends: ["Field"],
      selector: (node) => node.props?.["x-component"] === `${name}.MoveUp`,
      designerProps: {
        allowDrop(parent) {
          return parent.props?.["x-component"] === name;
        },
        propsSchema: createVoidFieldSchema(),
      },
      designerLocales:
        (locales as any).ArrayMoveUp ?? ArrayBaseLocales.ArrayMoveUp,
    },
    {
      name: `${name}.MoveDown`,
      extends: ["Field"],
      selector: (node) => node.props?.["x-component"] === `${name}.MoveDown`,
      designerProps: {
        allowDrop(parent) {
          return parent.props?.["x-component"] === "ArrayCards";
        },
        propsSchema: createVoidFieldSchema(),
      },
      designerLocales:
        (locales as any).ArrayMoveDown ?? ArrayBaseLocales.ArrayMoveDown,
    },
  );
};
