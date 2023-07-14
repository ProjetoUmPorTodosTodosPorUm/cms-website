<script lang="ts">
	import '$lib/scss/dashboard.scss';
	import '$lib/scss/dashboard-form.scss';
	import AppContainer from '$components/app-container.svelte';
	import AppContent from '$components/app-content.svelte';
	import { generateMessages } from '$components/toast.svelte';

	import Icon from 'svelte-icons-pack/Icon.svelte';
	import HiOutlinePencil from 'svelte-icons-pack/hi/HiOutlinePencil';
	import HiOutlineMenuAlt2 from 'svelte-icons-pack/hi/HiOutlineMenuAlt2';
	import HiOutlinePaperClip from 'svelte-icons-pack/hi/HiOutlinePaperClip';
	import HiOutlineCalendar from 'svelte-icons-pack/hi/HiOutlineCalendar';
	import HiOutlineTag from 'svelte-icons-pack/hi/HiOutlineTag';
	import HiOutlineGlobe from 'svelte-icons-pack/hi/HiOutlineGlobe';

	import * as yup from 'yup';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import type { PageData } from '../../users/add/$types';
	import type { FieldDto, FileDto, Pagination } from '$src/lib/types';
	import { fromPaginationToQuery } from '$src/lib/utils/functions';
	import type { UserStore } from '$src/lib/store/user';
	import { ReportType } from '$src/lib/enums';
	import { getContext, onMount } from 'svelte';

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async';
	import LL, { setLocale } from '$i18n/i18n-svelte';
	$: i18n = $LL.reports.add;
	$: sharedI18n = $LL.shared;

	export let data: PageData;
	let userStore = getContext<UserStore>('userStore');
	let isAdminOrVolunteer = true;

	// App Content Options
	const showActions = false;
	const showRefreshButton = true;

	// App Header
	$: appHeader = {
		name: i18n.appHeader.name(),
		buttonText: ''
	};

	const query = {
		itemsPerPage: 100,
		page: 1,
		deleted: false,
		orderKey: 'designation',
		orderValue: 'asc'
	} as Pagination;
	$: queryString = fromPaginationToQuery(query);
	$: {
		month = type === ReportType.ANNUAL ? null : month;
	}

	// Form
	let formRef: HTMLFormElement;
	let isLoading = false;
	let fields: FieldDto[] = [];

	$: reportTypes = [
		{ value: 'ORDINARY', text: i18n.reportTypes.ordinary() },
		{ value: 'SEMESTER', text: i18n.reportTypes.semester() },
		{ value: 'ANNUAL', text: i18n.reportTypes.annual() }
	];

	$: schema = yup.object().shape({
		title: yup.string().required(sharedI18n.yup.required({ field: i18n.inputs.titleLabel() })),
		text: yup.string().nullable().optional(),
		shortDescription: yup
			.string()
			.required(sharedI18n.yup.required({ field: i18n.inputs.shortDescriptionLabel() })),
		attachments: yup
			.array(yup.string())
			.min(1, sharedI18n.yup.min({ field: i18n.inputs.attachmentsLabel(), length: 1 }))
			.required(sharedI18n.yup.required({ field: i18n.inputs.attachmentsLabel() })),
		month: yup
			.number()
			.typeError(sharedI18n.yup.number({ field: i18n.inputs.monthLabel() }))
			.when('type', {
				is: (val: ReportType) => val !== ReportType.ANNUAL && val !== null,
				then: (schema) =>
					schema
						.integer(sharedI18n.yup.integer({ field: i18n.inputs.monthLabel() }))
						.min(1, sharedI18n.yup.minNumber({ field: i18n.inputs.monthLabel(), value: 1 }))
						.max(12, sharedI18n.yup.maxNumber({ field: i18n.inputs.monthLabel(), value: 1 }))
						.required(sharedI18n.yup.required({ field: i18n.inputs.monthLabel() })),
				otherwise: (schema) => schema.nullable().optional()
			}),
		year: yup
			.number()
			.typeError(sharedI18n.yup.number({ field: i18n.inputs.yearLabel() }))
			.integer(sharedI18n.yup.integer({ field: i18n.inputs.yearLabel() }))
			.min(2000, sharedI18n.yup.minNumber({ field: i18n.inputs.yearLabel(), value: 2000 }))
			.max(2100, sharedI18n.yup.maxNumber({ field: i18n.inputs.yearLabel(), value: 2100 }))
			.required(sharedI18n.yup.required({ field: i18n.inputs.yearLabel() })),
		type: yup
			.string()
			.oneOf(
				Object.values(ReportType),
				sharedI18n.yup.oneOf({ enums: reportTypes.map((r) => r.text).join(', ') })
			)
			.required(sharedI18n.yup.required({ field: i18n.inputs.typeLabel() })),
		field: yup.string().nullable().optional()
	});

	let title: string;
	let text: string;
	let shortDescription: string;
	let attachments: string[];
	let month: number | null;
	let year: number;
	let type: ReportType | null = null;
	let field: string | null;

	let filesToUpload: File[] | null;
	let messages: any[] = [];

	onMount(async () => {
		await loadData();
		isAdminOrVolunteer = userStore.isVolunteer() || userStore.isAdmin();

		await loadNamespaceAsync(data.locale, 'reports');
		await loadNamespaceAsync(data.locale, 'shared');
		setLocale(data.locale);
	});

	async function loadData() {
		try {
			isLoading = true;
			fields = (await axios.get(`/field?${queryString}`)).data.data;
			isLoading = false;
		} catch (error) {
			isLoading = false;

			if (error instanceof Axios.AxiosError) {
				messages = generateMessages([{ message: error.response?.data.message }]);
			} else if (error instanceof yup.ValidationError) {
				messages = generateMessages(error.inner.map((err) => ({ message: err.message })));
			} else {
				console.warn(error);
			}
		}
	}

	async function onSubmit(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		isLoading = true;

		try {
			const isValid = schema.validateSync(
				{ title, text, shortDescription, attachments, month, year, type, field },
				{ abortEarly: false }
			);

			if (isValid) {
				if (filesToUpload) {
					await uploadFiles(filesToUpload);
				}

				const postData = {
					title,
					text,
					shortDescription,
					attachments,
					month,
					year,
					type,
					field
				};
				if (isAdminOrVolunteer) {
					// @ts-ignore
					delete postData.field;
				}
				if (!month) {
					// @ts-ignore
					delete postData.month;
				}
				const res = await axios.post('/report', postData);

				isLoading = false;
				messages = generateMessages([{ message: res.data.message, variant: 'success' }]);
				eraseForm();
			}
		} catch (error) {
			isLoading = false;

			if (error instanceof Axios.AxiosError) {
				if (error.response) {
					messages = generateMessages(
						(error.response?.data.data as string[]).map((err) => ({ message: err }))
					);
				} else {
					messages = generateMessages([{ message: error.message }]);
				}
			} else if (error instanceof yup.ValidationError) {
				messages = generateMessages(error.inner.map((err) => ({ message: err.message })));
			} else {
				console.warn(error);
			}
		}
	}

	function eraseForm() {
		formRef.reset();
		field = null;
		type = null;
	}

	function onFileInputChange(event: Event) {
		const files = (event.target as any).files as File[];
		if (files.length > 0) {
			filesToUpload = files;
			attachments = ['yupbypass'];
		} else {
			filesToUpload = null;
			attachments = [];
		}
	}

	async function uploadFiles(files: File[]) {
		try {
			let formData = new FormData();
			for (let i = 0; i < files.length; i++) {
				formData.append('files', files[i]);
			}

			const res = await axios.post('/file/bulk', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});

			messages = generateMessages([{ message: res.data.message, variant: 'success' }]);
			attachments = (res.data.data as FileDto[]).map((file) => file.name);
		} catch (error) {
			if (error instanceof Axios.AxiosError) {
				throw new Axios.AxiosError(sharedI18n.axios.fileSizeError());
			} else {
				console.warn(error);
			}
		}
	}
</script>

<svelte:head>
	<title>{i18n.pageTitle()}</title>
</svelte:head>

<AppContainer {messages} locale={data.locale}>
	<AppContent
		{...appHeader}
		{isLoading}
		{showActions}
		{showRefreshButton}
		locale={data.locale}
		on:click={onSubmit}
	>
		<form bind:this={formRef} on:submit|preventDefault|stopPropagation={onSubmit} class="app-form">
			<div class="input">
				<Icon src={HiOutlinePencil} />
				<input
					bind:value={title}
					name="title"
					placeholder={i18n.inputs.titleLabel()}
					autocomplete="off"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMenuAlt2} />
				<textarea
					bind:value={shortDescription}
					name="shortDescription"
					placeholder={i18n.inputs.shortDescriptionLabel()}
					autocomplete="off"
					rows="5"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMenuAlt2} />
				<textarea
					bind:value={text}
					name="text"
					placeholder={i18n.inputs.textLabel()}
					autocomplete="off"
					rows="5"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlinePaperClip} />
				<input
					on:change={onFileInputChange}
					name="attachments"
					multiple
					type="file"
					accept="application/pdf"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCalendar} />
				<div class="number">
					<input
						bind:value={month}
						name="month"
						placeholder={i18n.inputs.monthLabel()}
						type="number"
						min="1"
						max="12"
						disabled={type == ReportType.ANNUAL}
					/>
				</div>
				<div class="number">
					<input
						bind:value={year}
						name="year"
						placeholder={i18n.inputs.yearLabel()}
						type="number"
						min="2000"
						max="2100"
						required
					/>
				</div>
			</div>
			<div class="input">
				<Icon src={HiOutlineTag} />
				<select bind:value={type} name="type" required>
					<option value={null} disabled selected>{i18n.inputs.typeLabel()}</option>

					{#each reportTypes as reportType}
						<option value={reportType.value}>{reportType.text}</option>
					{/each}
				</select>
			</div>
			{#if !isAdminOrVolunteer}
				<div class="input">
					<Icon src={HiOutlineGlobe} />
					<select bind:value={field} name="field" required>
						<option value={null} disabled selected>{sharedI18n.inputs.fieldLabel()}</option>

						{#each fields as field}
							<option value={field.id}>
								{field.abbreviation} - {field.designation}
							</option>
						{/each}
					</select>
				</div>
			{/if}
			<div class="input">
				<input
					on:click={onSubmit}
					class="submit"
					type="submit"
					value={i18n.appHeader.buttonText()}
				/>
			</div>
		</form>
	</AppContent>
</AppContainer>
