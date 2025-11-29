"use client";

import { useState } from "react";
import Link from "next/link";
import css from "./TagsMenu.module.css";

// const TAGS = ["Work", "Personal", "Meeting", "Shopping", "Todo"];
const TAGS = ["Work", "Personal", "Meeting", "Shopping", "Ideas", "Travel", "Finance", "Health","Important", "Todo"];



export default function TagsMenu() {
    
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className={css.menuContainer}>
      <button onClick={toggle} className={css.menuBtn}>
        Notes ▾
      </button>
      {isOpen && (
        <ul className={css.menu}>
          <li className={css.menuItem}>
            <Link
              href={`/notes/filter/All`}
              className={css.menuLink} onClick={toggle}>
              All notes
            </Link>
          </li>
          {TAGS.map((tag) => (
            <li key={tag} className={css.menuItem}>
              <Link
                href={`/notes/filter/${tag}`}
                className={css.menuLink} onClick={toggle}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>)}
    </div>
  );
}