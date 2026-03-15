import { useState, useEffect, useRef, useCallback } from "react";
import type { Building } from "../../utils/buildings";
import styles from "./address-selector.module.scss";

interface AddressSelectorProps {
    buildings: Building[];
    selected: Building | null;
    onChange: (building: Building | null) => void;
}

function normalizeSearchValue(value: string) {
    return value
        .toLocaleLowerCase("lt-LT")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
}

function tokenizeSearchValue(value: string) {
    return normalizeSearchValue(value)
        .replace(/[^a-z0-9]+/g, " ")
        .split(/\s+/)
        .filter(Boolean);
}

export function AddressSelector({ buildings, selected, onChange }: AddressSelectorProps) {
    const [inputValue, setInputValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const skipNextFocusOpenRef = useRef(false);

    const dismissInput = useCallback(() => {
        inputRef.current?.blur();
    }, []);

    // Filter buildings based on input
    const normalizedInputValue = normalizeSearchValue(inputValue).trim();
    const searchTokens = tokenizeSearchValue(inputValue);
    const filteredBuildings = buildings.filter((building) => {
        const normalizedLabel = normalizeSearchValue(building.label);

        if (!normalizedInputValue) {
            return true;
        }

        if (normalizedLabel.includes(normalizedInputValue)) {
            return true;
        }

        const labelTokens = tokenizeSearchValue(building.label);
        return searchTokens.every((token) => labelTokens.some((labelToken) => labelToken.includes(token)));
    });

    // Reset highlighted index when filtered list changes
    useEffect(() => {
        setHighlightedIndex(-1);
    }, [filteredBuildings.length, inputValue]);

    // Sync input value with selected building label
    useEffect(() => {
        if (selected) {
            setInputValue(selected.label);
        } else {
            setInputValue("");
        }
    }, [selected]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle building selection
    const handleSelect = useCallback(
        (building: Building) => {
            skipNextFocusOpenRef.current = true;
            setInputValue(building.label);
            onChange(building);
            setIsOpen(false);
            setHighlightedIndex(-1);
            dismissInput();
        },
        [dismissInput, onChange],
    );

    // Handle clear
    const handleClear = useCallback(() => {
        skipNextFocusOpenRef.current = true;
        onChange(null);
        setInputValue("");
        setIsOpen(false);
        dismissInput();
    }, [dismissInput, onChange]);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex((prev) => (prev < filteredBuildings.length - 1 ? prev + 1 : prev));
                break;
            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
                break;
            case "Enter":
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < filteredBuildings.length) {
                    handleSelect(filteredBuildings[highlightedIndex]);
                }
                break;
            case "Escape":
                e.preventDefault();
                setIsOpen(false);
                setHighlightedIndex(-1);
                break;
            case "Tab":
                setIsOpen(false);
                break;
        }
    };

    // Scroll highlighted item into view
    useEffect(() => {
        if (highlightedIndex >= 0 && listRef.current) {
            const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
            if (highlightedElement) {
                highlightedElement.scrollIntoView({ block: "nearest" });
            }
        }
    }, [highlightedIndex]);

    return (
        <div className={styles.addressSelector} ref={containerRef}>
            <div className={styles.inputWrapper}>
                <input
                    ref={inputRef}
                    type="text"
                    className={styles.input}
                    placeholder="Pasirinkite savo namą…"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setIsOpen(true);
                        setHighlightedIndex(-1);
                    }}
                    onFocus={() => {
                        if (skipNextFocusOpenRef.current) {
                            skipNextFocusOpenRef.current = false;
                            return;
                        }

                        setIsOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    aria-autocomplete="list"
                    aria-controls="address-listbox"
                    aria-expanded={isOpen}
                    role="combobox"
                />
                {selected && (
                    <button
                        type="button"
                        className={styles.clearButton}
                        onClick={handleClear}
                        aria-label="Išvalyti pasirinkimą"
                    >
                        ×
                    </button>
                )}
            </div>

            {isOpen && filteredBuildings.length > 0 && (
                <ul
                    ref={listRef}
                    id="address-listbox"
                    className={styles.dropdown}
                    role="listbox"
                    aria-label="Adresų sąrašas"
                >
                    {filteredBuildings.map((building, index) => (
                        <li
                            key={building.id}
                            className={`${styles.dropdownItem} ${
                                index === highlightedIndex ? styles.highlighted : ""
                            } ${building.id === selected?.id ? styles.selected : ""}`}
                            onClick={() => handleSelect(building)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            role="option"
                            aria-selected={building.id === selected?.id}
                        >
                            {building.label}
                        </li>
                    ))}
                </ul>
            )}

            {isOpen && inputValue && filteredBuildings.length === 0 && (
                <div className={styles.noResults}>Nerasta rezultatų</div>
            )}
        </div>
    );
}
