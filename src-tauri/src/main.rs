// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use tauri::State;
use serde_json::Value;

// Define your custom AppState structure with fields that represent your application's state.
struct AppState {
    // For simplicity, let's assume you have a configuration option.
    config_path: String,
}

#[tauri::command]
fn file_exists(state: State<'_, AppState>, path: String) -> Result<bool, String> {
    // Check if the file at the specified path exists
    match fs::metadata(&path) {
        Ok(_) => Ok(true), // File exists
        Err(_) => Err("File does not exist".to_string()), // File doesn't exist
    }
}

#[tauri::command]
fn read_excel_file(state: State<'_, AppState>, path: String) -> Result<Vec<u8>, String> {
    // Check if the file at the specified path exists
    match fs::metadata(&path) {
        Ok(_) => {
            // File exists, read its content and return it as binary data
            match fs::read(&path) {
                Ok(content) => Ok(content),
                Err(_) => Err("Error reading the file".to_string()),
            }
        }
        Err(_) => Err("File does not exist".to_string()), // File doesn't exist
    }
}

fn main() {
    // Initialize your app state with a configuration file path.
    let app_state = AppState {
        config_path: "config.json".to_string(),
    };

    tauri::Builder::default()
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![file_exists, read_excel_file])
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}