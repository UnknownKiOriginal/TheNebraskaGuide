import * as React from 'react'; //* means to import everything
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { createContext, useState } from 'react';
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV(); //creates storage
//*Personal note: exporting it makes it public so we don't have to create new storages for each file

//Created by Gemini
export const storageProvider = {
   set: (key, value) => storage.set(key, value),
   getString: (key) => storage.getString(key),
   delete: (key) => storage.delete(key)
};

/*
FILE SUMMARY
The Storage file is the local storage/database I have for my app which essentially allows for everythign done 
in the app to be saved unless you wipe the storage in settings or you uninstall the app. If you do any type
of clearing it needs to be backed up online. It remembers things like the logged in status along with usernames
and favorited items.
*/