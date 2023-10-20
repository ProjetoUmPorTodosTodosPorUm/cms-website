import type { Actions } from '@sveltejs/kit'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import { generateMessages, safeFetch, actionErrorHandler } from '$utils'
import { ApiError } from '$classes/api-error'

export const actions = {
    post: async ({ fetch, request, locals, cookies }) => {
        const i18n = locals.LL['collected-offers'].add
        const sharedI18n = locals.LL.shared

        const schema = yup.object().shape({
            month: yup
                .number()
                .typeError(sharedI18n.yup.number({ field: i18n.inputs.monthLabel() }))
                .integer(sharedI18n.yup.integer({ field: i18n.inputs.monthLabel() }))
                .min(
                    1,
                    sharedI18n.yup.minNumber({
                        field: i18n.inputs.monthLabel(),
                        value: 1
                    })
                )
                .max(
                    12,
                    sharedI18n.yup.maxNumber({
                        field: i18n.inputs.monthLabel(),
                        value: 12
                    })
                )
                .required(sharedI18n.yup.required({ field: i18n.inputs.monthLabel() })),
            year: yup
                .number()
                .typeError(sharedI18n.yup.number({ field: i18n.inputs.yearLabel() }))
                .integer(sharedI18n.yup.integer({ field: i18n.inputs.yearLabel() }))
                .min(
                    2000,
                    sharedI18n.yup.minNumber({
                        field: i18n.inputs.yearLabel(),
                        value: 2000
                    })
                )
                .max(
                    2100,
                    sharedI18n.yup.maxNumber({
                        field: i18n.inputs.yearLabel(),
                        value: 2100
                    })
                )
                .required(sharedI18n.yup.required({ field: i18n.inputs.yearLabel() })),
            foodQnt: yup
                .number()
                .typeError(sharedI18n.yup.number({ field: i18n.inputs.foodQntLabel() }))
                .integer(sharedI18n.yup.integer({ field: i18n.inputs.foodQntLabel() }))
                .required(sharedI18n.yup.required({ field: i18n.inputs.foodQntLabel() })),
            monetaryValue: yup
                .number()
                .typeError(sharedI18n.yup.number({ field: i18n.inputs.monetaryValueLabel() }))
                .required(sharedI18n.yup.required({ field: i18n.inputs.monetaryValueLabel() })),
            othersQnt: yup
                .number()
                .typeError(sharedI18n.yup.number({ field: i18n.inputs.othersQntLabel() }))
                .integer(sharedI18n.yup.integer({ field: i18n.inputs.othersQntLabel() }))
                .required(sharedI18n.yup.required({ field: i18n.inputs.othersQntLabel() })),
            field: yup.string().nullable().optional()
        })

        const data = await request.formData()
        const month = data.get('month')
        const year = data.get('year')
        const foodQnt = data.get('foodQnt')
        const monetaryValue = data.get('monetaryValue')
        const othersQnt = data.get('othersQnt')
        const field = data.get('field')

        try {
            schema.validateSync({ month, year, foodQnt, monetaryValue, othersQnt, field }, { abortEarly: false })

            const res = await safeFetch(fetch, cookies, {
                url: `${PUBLIC_API_URL}/monthly-offer`,
                method: 'POST',
                body: { month, year, foodQnt, monetaryValue, othersQnt, field }
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
} satisfies Actions
