import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
type BrandInfo = {
    profiles: any[];
    brandname: string;
};
type MyBrand = {
    number_profiles: number,
    name: string,
    totalFollowers: number,
    totalEngadgement: number,
    id: string,
    date: number
}

@Injectable({ providedIn: "root" }) //providers

export class GetBrands {
    constructor(private http: HttpClient) { }
    bodyBrands = {
        jsonrpc: '2.0',
        id: 0,
        method: "socialinsider_api.get_brands",
        params: { projectname: "API_test" }
    }
    headers = new HttpHeaders(
        {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer API_KEY_TEST'
        })
    bodyProfiles = {
        jsonrpc: '2.0',
        id: 1,
        method: 'socialinsider_api.get_profile_data',
        params: {
            id: '',
            profile_type: null,
            date: {
                start: 0,
                end: 0,
                timezone: 'Europe/London',
            },
        },
    }
    brandsArray: BrandInfo[] = [];
    brandArray: MyBrand[] = []

    bodyInitialization(profiles: any, startDate: number, endDate: number,) {
        this.bodyProfiles.params.id = profiles.id
        this.bodyProfiles.params.profile_type = profiles.profile_type
        this.bodyProfiles.params.date.start = startDate
        this.bodyProfiles.params.date.end = endDate
    }

    async getProfiles(i: number) {
        let response = await this.http.post<{
            id_irelevant: number; error: string; resp: { [id: string]: [dates: { date: string, followers: number, engagement: number }] };
        }>('http://localhost:3000/api/profiles', this.bodyProfiles, { headers: this.headers })
            .toPromise()
        if (response?.resp) {
            console.log(response.resp)
            for (const key in response.resp) {
                for (const dates in response.resp[key]) {
                    let dateParts = response.resp[key][dates].date.split("-");
                    let current_date = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]))
                    if (response.resp[key][dates].engagement > 0) {
                        this.brandArray[i].totalEngadgement += response.resp[key][dates].engagement
                    }
                    if (response.resp[key][dates].followers > 0 && this.brandArray[i].date <= current_date.getTime()) {
                        this.brandArray[i].totalFollowers = response.resp[key][dates].followers
                        this.brandArray[i].date = current_date.getTime()
                    }
                }
            }
        }
    }
    async getBrands(startDate: number, endDate: number) {
        const response =
            await this.http.post<{ id: number, error: string, result: [] }>
                ('http://localhost:3000/api/brands', this.bodyBrands, { headers: this.headers })
                .toPromise()
        if (response) {
            this.brandsArray = response.result;
            for (let i = 0; i < this.brandsArray.length; i++) {
                this.brandArray[i] = { name: '', number_profiles: 0, totalFollowers: 0, totalEngadgement: 0, id: '', date: 0 }
                this.brandArray[i].name = this.brandsArray[i].brandname
                this.brandArray[i].number_profiles = this.brandsArray[i].profiles.length
                const promises = this.brandsArray[i].profiles.map((profile) => {
                    this.bodyInitialization(profile, startDate, endDate);
                    return this.getProfiles(i)
                })
                await Promise.all(promises)
            }
        }
    }

} 