// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */

import { initFormatters } from './formatters'
import type { Locales, Translations } from './i18n-types'
import { loadedFormatters, loadedLocales, locales } from './i18n-util'

import en from './en'
import pt_BR from './pt-BR'

import en_agenda from './en/agenda'
import en_announcements from './en/announcements'
import en_app_actions from './en/app-actions'
import en_app_header from './en/app-header'
import en_app_nav from './en/app-nav'
import en_churches from './en/churches'
import en_collaborators from './en/collaborators'
import en_collected_offers from './en/collected-offers'
import en_collection_header from './en/collection-header'
import en_collection_row from './en/collection-row'
import en_collection_row_placeholder from './en/collection-row-placeholder'
import en_dashboard from './en/dashboard'
import en_fields from './en/fields'
import en_files from './en/files'
import en_forgot_password from './en/forgot-password'
import en_login from './en/login'
import en_logs from './en/logs'
import en_offeror_families from './en/offeror-families'
import en_profile from './en/profile'
import en_reports from './en/reports'
import en_shared from './en/shared'
import en_signup from './en/signup'
import en_testimonials from './en/testimonials'
import en_toast from './en/toast'
import en_tokens from './en/tokens'
import en_users from './en/users'
import en_volunteers from './en/volunteers'
import en_welcomed_families from './en/welcomed-families'
import pt_BR_agenda from './pt-BR/agenda'
import pt_BR_announcements from './pt-BR/announcements'
import pt_BR_app_actions from './pt-BR/app-actions'
import pt_BR_app_header from './pt-BR/app-header'
import pt_BR_app_nav from './pt-BR/app-nav'
import pt_BR_churches from './pt-BR/churches'
import pt_BR_collaborators from './pt-BR/collaborators'
import pt_BR_collected_offers from './pt-BR/collected-offers'
import pt_BR_collection_header from './pt-BR/collection-header'
import pt_BR_collection_row from './pt-BR/collection-row'
import pt_BR_collection_row_placeholder from './pt-BR/collection-row-placeholder'
import pt_BR_dashboard from './pt-BR/dashboard'
import pt_BR_fields from './pt-BR/fields'
import pt_BR_files from './pt-BR/files'
import pt_BR_forgot_password from './pt-BR/forgot-password'
import pt_BR_login from './pt-BR/login'
import pt_BR_logs from './pt-BR/logs'
import pt_BR_offeror_families from './pt-BR/offeror-families'
import pt_BR_profile from './pt-BR/profile'
import pt_BR_reports from './pt-BR/reports'
import pt_BR_shared from './pt-BR/shared'
import pt_BR_signup from './pt-BR/signup'
import pt_BR_testimonials from './pt-BR/testimonials'
import pt_BR_toast from './pt-BR/toast'
import pt_BR_tokens from './pt-BR/tokens'
import pt_BR_users from './pt-BR/users'
import pt_BR_volunteers from './pt-BR/volunteers'
import pt_BR_welcomed_families from './pt-BR/welcomed-families'

const localeTranslations = {
	en: {
		...en,
		agenda: en_agenda,
		announcements: en_announcements,
		'app-actions': en_app_actions,
		'app-header': en_app_header,
		'app-nav': en_app_nav,
		churches: en_churches,
		collaborators: en_collaborators,
		'collected-offers': en_collected_offers,
		'collection-header': en_collection_header,
		'collection-row': en_collection_row,
		'collection-row-placeholder': en_collection_row_placeholder,
		dashboard: en_dashboard,
		fields: en_fields,
		files: en_files,
		'forgot-password': en_forgot_password,
		login: en_login,
		logs: en_logs,
		'offeror-families': en_offeror_families,
		profile: en_profile,
		reports: en_reports,
		shared: en_shared,
		signup: en_signup,
		testimonials: en_testimonials,
		toast: en_toast,
		tokens: en_tokens,
		users: en_users,
		volunteers: en_volunteers,
		'welcomed-families': en_welcomed_families
	},
	'pt-BR': {
		...pt_BR,
		agenda: pt_BR_agenda,
		announcements: pt_BR_announcements,
		'app-actions': pt_BR_app_actions,
		'app-header': pt_BR_app_header,
		'app-nav': pt_BR_app_nav,
		churches: pt_BR_churches,
		collaborators: pt_BR_collaborators,
		'collected-offers': pt_BR_collected_offers,
		'collection-header': pt_BR_collection_header,
		'collection-row': pt_BR_collection_row,
		'collection-row-placeholder': pt_BR_collection_row_placeholder,
		dashboard: pt_BR_dashboard,
		fields: pt_BR_fields,
		files: pt_BR_files,
		'forgot-password': pt_BR_forgot_password,
		login: pt_BR_login,
		logs: pt_BR_logs,
		'offeror-families': pt_BR_offeror_families,
		profile: pt_BR_profile,
		reports: pt_BR_reports,
		shared: pt_BR_shared,
		signup: pt_BR_signup,
		testimonials: pt_BR_testimonials,
		toast: pt_BR_toast,
		tokens: pt_BR_tokens,
		users: pt_BR_users,
		volunteers: pt_BR_volunteers,
		'welcomed-families': pt_BR_welcomed_families
	}
}

export const loadLocale = (locale: Locales): void => {
	if (loadedLocales[locale]) return

	loadedLocales[locale] = localeTranslations[locale] as unknown as Translations
	loadFormatters(locale)
}

export const loadAllLocales = (): void => locales.forEach(loadLocale)

export const loadFormatters = (locale: Locales): void =>
	void (loadedFormatters[locale] = initFormatters(locale))
