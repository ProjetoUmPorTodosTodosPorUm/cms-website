import type { Actions } from '@sveltejs/kit'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import { generateMessages, safeFetch, actionErrorHandler, bulkFileAction, fileRemoveAction } from '$utils'
import { ApiError } from '$classes/api-error'

export const actions = {
    post: async ({ fetch, request, locals, cookies }) => {
        const i18n = locals.LL.announcements.add
        const sharedI18n = locals.LL.shared

        const schema = yup.object().shape({
            title: yup.string().required(sharedI18n.yup.required({ field: i18n.inputs.titleLabel() })),
            message: yup.string().required(sharedI18n.yup.required({ field: i18n.inputs.messageLabel() })),
            attachments: yup.array(yup.string()).nullable().optional(),
            fixed: yup.boolean().required(sharedI18n.yup.required({ field: i18n.inputs.fixedLabel() })),
            field: yup.string().nullable().optional()
        })

        const data = await request.formData()
        const title = data.get('title')
        const message = data.get('message')
        const attachments = data.get('attachments')?.toString()
        const arrAttachments = attachments && attachments?.length > 0 ? attachments?.split(',') : []
        const fixed = data.get('fixed')?.toString() === "true"
        const field = data.get('field')

        try {
            schema.validateSync({ title, message, attachments: arrAttachments, fixed, field }, { abortEarly: false })

            const res = await safeFetch(fetch, cookies, {
                url: `${PUBLIC_API_URL}/announcement`,
                method: 'POST',
                body: { title, message, attachments: arrAttachments, fixed, field }
            })
            let resJson: ApiResponseDto

            if (res && res.status !== 201) {
                throw new ApiError((await res.json()) as ApiResponseDto, res.status)
            } else {
                resJson = await res?.json()
            }

            return {
                apiData: resJson.data,
                messages: generateMessages([{ message: resJson.message, variant: 'success' }])
            }
        } catch (error) {
            return actionErrorHandler(error)
        }
    },

    bulkFile: async ({ fetch, request, cookies }) => {
        return await bulkFileAction(fetch, request, cookies)
    },

    fileRemove: async ({ fetch, request, cookies }) => {
        return await fileRemoveAction(fetch, request, cookies)
    }
} satisfies Actions
