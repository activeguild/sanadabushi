import { useState, useMemo, FocusEvent, ChangeEvent } from "react";
import styles from "./App.module.css";
import { parse } from "postcss";

function App() {
  const [source, setSource] = useState("");
  const [classesValue, setClassesValue] = useState("");
  const [stylesValue, setStylesValue] = useState("");

  const classes = useMemo(() => {
    const root = parse(source);
    let classes = new Map<string, string[]>();

    root.nodes.map((node) => {
      if (node.type === "rule" && node.selector.startsWith(".")) {
        const styles = new Array<string>();

        for (const childNode of node.nodes) {
          if (childNode.type === "decl") {
            styles.push(`${childNode.prop}: ${childNode.value};`);
          }
        }

        classes.set(node.selector.replace(".", ""), styles);
      }
    });

    return classes;
  }, [source]);

  const handleBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    let stylesStr = "";

    const inputClasses = value.split(" ");

    for (const inputClass of inputClasses) {
      if (classes.has(inputClass)) {
        const matchedStyles = classes.get(inputClass);
        if (matchedStyles) {
          for (const matchedStyle of matchedStyles) {
            stylesStr = `${stylesStr}${matchedStyle}\n`;
          }
        }
      }
    }

    setStylesValue(stylesStr);
  };

  const handleClassesValueChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setClassesValue(value);
  };

  const handleSourceValueChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setSource(value);
  };

  const handleSourceBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setSource(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h1>css</h1>
        <textarea
          value={source}
          cols={30}
          rows={10}
          onChange={handleSourceValueChange}
          onBlur={handleSourceBlur}
        ></textarea>
      </div>
      <div className={styles.center}>
        <h1>classes</h1>
        <textarea
          value={classesValue}
          cols={30}
          rows={10}
          onChange={handleClassesValueChange}
          onBlur={handleBlur}
        ></textarea>
      </div>
      <div className={styles.right}>
        <h1>output styles</h1>
        <textarea readOnly value={stylesValue} cols={30} rows={10}></textarea>
      </div>
    </div>
  );
}

export default App;
